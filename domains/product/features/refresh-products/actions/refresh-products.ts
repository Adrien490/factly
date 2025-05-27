"use server";

import { auth } from "@/domains/auth";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { refreshProductsSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir la liste des produits
 * Validations :
 * - L'utilisateur doit être authentifié
 */
export const refreshProducts: ServerAction<
	null,
	typeof refreshProductsSchema
> = async () => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour rafraîchir les produits"
			);
		}

		// 2. Récupération des données
		const rawData = {};

		// 3. Validation des données
		const validation = refreshProductsSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée"
			);
		}

		// 4. Invalidation du cache
		revalidateTag(`products`);

		return createSuccessResponse(null, "Liste des produits rafraîchie");
	} catch (error) {
		console.error("[REFRESH_PRODUCTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors du rafraîchissement"
		);
	}
};
