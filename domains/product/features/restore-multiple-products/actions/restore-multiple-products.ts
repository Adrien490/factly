"use server";

import { auth } from "@/domains/auth";
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
import { restoreMultipleProductsSchema } from "../schemas/restore-multiple-products-schema";

export const restoreMultipleProducts: ServerAction<
	Product[],
	typeof restoreMultipleProductsSchema
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
		const ids = formData.getAll("ids") as string[];
		const status = formData.get("status") as ProductStatus;

		// 3. Validation des données
		const validation = restoreMultipleProductsSchema.safeParse({
			ids,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 5. Vérification de l'existence des produits
		const existingProducts = await db.product.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
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

		// 6. Filtrer les produits qui sont actuellement archivés
		const productsToRestore = existingProducts.filter(
			(product) => product.status === ProductStatus.ARCHIVED
		);

		if (productsToRestore.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Aucun des produits sélectionnés n'est archivé"
			);
		}

		// 6.1 Vérifier les transitions de statut pour chaque produit
		const invalidTransitions = productsToRestore
			.map((product) => {
				const validationResult = validateProductStatusTransition({
					currentStatus: product.status,
					newStatus: validation.data.status,
				});
				return {
					productId: product.id,
					isValid: validationResult.isValid,
					message: validationResult.message,
				};
			})
			.filter((result) => !result.isValid);

		if (invalidTransitions.length > 0) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				`La transition de ARCHIVED vers ${validation.data.status} n'est pas autorisée pour ${invalidTransitions.length} produit(s)`
			);
		}

		// 7. Mise à jour des produits avec le statut spécifié
		await db.product.updateMany({
			where: {
				id: {
					in: productsToRestore.map((product) => product.id),
				},
			},
			data: {
				status: validation.data.status,
			},
		});

		// Récupération des produits mis à jour
		const updatedProducts = await db.product.findMany({
			where: {
				id: {
					in: productsToRestore.map((product) => product.id),
				},
			},
		});

		// 8. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`products:${id}`);
		}
		revalidateTag(`products`);
		revalidateTag(`products:count`);

		// 9. Message de succès personnalisé
		const statusText =
			validation.data.status === ProductStatus.ACTIVE
				? "actif"
				: validation.data.status === ProductStatus.INACTIVE
					? "inactif"
					: validation.data.status === ProductStatus.DRAFT
						? "brouillon"
						: validation.data.status === ProductStatus.DISCONTINUED
							? "obsolète"
							: "autre statut";

		const message = `${productsToRestore.length} produit(s) ont été restauré(s) en ${statusText} avec succès`;

		return createSuccessResponse(updatedProducts, message, {
			restoredProductIds: productsToRestore.map((product) => product.id),
		});
	} catch (error) {
		console.error("[RESTORE_MULTIPLE_PRODUCTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration des produits"
		);
	}
};
