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
import { updateMultipleProductStatusSchema } from "../schemas/update-multiple-product-status-schema";

export const updateMultipleProductStatus: ServerAction<
	Product[],
	typeof updateMultipleProductStatusSchema
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
		const validation = updateMultipleProductStatusSchema.safeParse({
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
				name: true,
			},
		});

		if (existingProducts.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Un ou plusieurs produits n'ont pas été trouvés"
			);
		}

		// 6. Validation des transitions de statut
		const invalidTransitions = [];
		for (const product of existingProducts) {
			const transitionValidation = validateProductStatusTransition({
				currentStatus: product.status,
				newStatus: validation.data.status,
			});

			if (!transitionValidation.isValid) {
				invalidTransitions.push({
					productId: product.id,
					productName: product.name,
					currentStatus: product.status,
					message: transitionValidation.message,
				});
			}
		}

		if (invalidTransitions.length > 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				`Transition de statut non autorisée pour ${invalidTransitions.length} produit(s)`
			);
		}

		// 7. Mise à jour des produits
		await db.product.updateMany({
			where: {
				id: {
					in: validation.data.ids,
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
					in: validation.data.ids,
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
				? "actifs"
				: validation.data.status === ProductStatus.INACTIVE
					? "inactifs"
					: validation.data.status === ProductStatus.DRAFT
						? "brouillons"
						: validation.data.status === ProductStatus.DISCONTINUED
							? "obsolètes"
							: validation.data.status === ProductStatus.ARCHIVED
								? "archivés"
								: "autre statut";

		const message = `${existingProducts.length} produit(s) ont été mis à jour en ${statusText} avec succès`;

		return createSuccessResponse(updatedProducts, message, {
			updatedProductIds: existingProducts.map((product) => product.id),
			number: existingProducts.length,
			status: validation.data.status,
			shouldClearAll: true,
		});
	} catch (error) {
		console.error("[UPDATE_MULTIPLE_PRODUCT_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
