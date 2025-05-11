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
import { restoreProductSchema } from "../schemas";

export const restoreProduct: ServerAction<
	Product,
	typeof restoreProductSchema
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
		const id = formData.get("id") as string;
		const organizationId = formData.get("organizationId") as string;
		const status = formData.get("status") as ProductStatus;

		// 3. Validation des données
		const validation = restoreProductSchema.safeParse({
			id,
			organizationId,
			status,
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

		// 5. Vérification de l'existence du produit
		const existingProduct = await db.product.findUnique({
			where: {
				id,
				organizationId,
			},
			select: {
				id: true,
				status: true,
				name: true,
			},
		});

		if (!existingProduct) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le produit n'a pas été trouvé"
			);
		}

		// 6. Vérification que le produit est bien archivé
		if (existingProduct.status !== ProductStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce produit n'est pas archivé"
			);
		}

		// 6.1 Validation de la transition de statut
		const validationResult = validateProductStatusTransition({
			currentStatus: existingProduct.status,
			newStatus: validation.data.status,
		});

		if (!validationResult.isValid) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				validationResult.message ||
					`La transition de ARCHIVED vers ${validation.data.status} n'est pas autorisée`
			);
		}

		// 7. Mise à jour du produit
		const updatedProduct = await db.product.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${organizationId}:products:${id}`);
		revalidateTag(`organizations:${organizationId}:products`);
		revalidateTag(`organizations:${organizationId}:products:count`);

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

		const message = `Le produit ${existingProduct.name} a été restauré en ${statusText} avec succès`;

		return createSuccessResponse(updatedProduct, message);
	} catch (error) {
		console.error("[RESTORE_PRODUCT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration du produit"
		);
	}
};
