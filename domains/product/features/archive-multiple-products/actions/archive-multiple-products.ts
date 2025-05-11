"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { validateProductStatusTransition } from "@/domains/product/utils";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Product, ProductStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { archiveMultipleProductsSchema } from "../schemas/archive-multiple-products-schema";

export const archiveMultipleProducts: ServerAction<
	Product[],
	typeof archiveMultipleProductsSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Récupération des données
		const organizationId = formData.get("organizationId") as string;
		const ids = formData.getAll("ids") as string[];

		// 3. Validation des données
		const validation = archiveMultipleProductsSchema.safeParse({
			ids,
			organizationId,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 5. Vérification de l'existence des produits
		const existingProducts = await db.product.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (existingProducts.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Un ou plusieurs produits n'ont pas été trouvés"
			);
		}

		// 6. Filtrer les produits qui ne sont pas déjà archivés
		const productsToArchive = existingProducts.filter(
			(product) => product.status !== ProductStatus.ARCHIVED
		);

		if (productsToArchive.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Tous les produits sélectionnés sont déjà archivés"
			);
		}

		// 6.1 Vérifier les transitions de statut pour chaque produit
		const invalidTransitions = productsToArchive
			.map((product) => {
				const { isValid, message } = validateProductStatusTransition({
					currentStatus: product.status,
					newStatus: ProductStatus.ARCHIVED,
				});
				return { productId: product.id, isValid, message };
			})
			.filter((result) => !result.isValid);

		if (invalidTransitions.length > 0) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				`La transition vers ARCHIVED n'est pas autorisée pour ${invalidTransitions.length} produit(s)`
			);
		}

		// 7. Mise à jour des produits
		await db.product.updateMany({
			where: {
				id: {
					in: productsToArchive.map((product) => product.id),
				},
				organizationId: validation.data.organizationId,
			},
			data: {
				status: ProductStatus.ARCHIVED,
			},
		});

		// Récupération des produits mis à jour
		const updatedProducts = await db.product.findMany({
			where: {
				id: {
					in: productsToArchive.map((product) => product.id),
				},
				organizationId: validation.data.organizationId,
			},
		});

		// 8. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`organizations:${organizationId}:products:${id}`);
		}
		revalidateTag(`organizations:${organizationId}:products`);

		// 9. Message de succès personnalisé
		const message = `${productsToArchive.length} produit(s) ont été archivé(s) avec succès`;

		return createSuccessResponse(updatedProducts, message);
	} catch (error) {
		console.error("[ARCHIVE_MULTIPLE_PRODUCTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage des produits"
		);
	}
};
