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
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteMultipleProductsSchema } from "../schemas";

export const deleteMultipleProducts: ServerAction<
	null,
	typeof deleteMultipleProductsSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer des produits"
			);
		}

		// 2. Récupération des données
		const rawData = {
			ids: formData.getAll("ids") as string[],
		};

		// 3. Validation des données
		const validation = deleteMultipleProductsSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'existence des produits
		const existingProducts = await db.product.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		if (existingProducts.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Un ou plusieurs produits n'ont pas été trouvés"
			);
		}

		// 5. Suppression des produits
		await db.product.deleteMany({
			where: {
				id: {
					in: validation.data.ids,
				},
			},
		});

		// 6. Invalidation du cache
		revalidateTag(`products`);
		for (const productId of validation.data.ids) {
			revalidateTag(`products:${productId}`);
		}

		return createSuccessResponse(
			null,
			`${existingProducts.length} produit(s) supprimé(s) avec succès`
		);
	} catch (error) {
		console.error("[DELETE_MULTIPLE_PRODUCTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la suppression des produits"
		);
	}
};
