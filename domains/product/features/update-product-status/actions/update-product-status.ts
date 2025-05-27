"use server";

import { auth } from "@/domains/auth";
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
import { updateProductStatusSchema } from "../schemas";

export const updateProductStatus: ServerAction<
	Product,
	typeof updateProductStatusSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier le statut d'un produit"
			);
		}

		// 2. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
			status: formData.get("status") as ProductStatus,
		};

		// 3. Validation des données
		const validation = updateProductStatusSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 4. Vérification de l'existence du produit
		const existingProduct = await db.product.findUnique({
			where: { id: validation.data.id },
			select: {
				id: true,
				status: true,
				name: true,
			},
		});

		if (!existingProduct) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Produit introuvable");
		}

		// 5. Vérification que le statut est différent
		if (existingProduct.status === validation.data.status) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"Le produit a déjà ce statut"
			);
		}

		// 6. Mise à jour du statut
		const updatedProduct = await db.product.update({
			where: { id: validation.data.id },
			data: {
				status: validation.data.status,
			},
		});

		// 7. Invalidation du cache
		revalidateTag(`products:${validation.data.id}`);
		revalidateTag(`products`);

		return createSuccessResponse(
			updatedProduct,
			`Statut du produit "${existingProduct.name}" mis à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_PRODUCT_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
