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
import { refreshSuppliersSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir les fournisseurs
 * Validations :
 * - L'utilisateur doit être authentifié
 */
export const refreshSuppliers: ServerAction<
	null,
	typeof refreshSuppliersSchema
> = async () => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour rafraîchir les fournisseurs"
			);
		}

		// 2. Validation des données avec le schéma Zod
		const validation = refreshSuppliersSchema.safeParse({});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée"
			);
		}

		revalidateTag(`suppliers`);
		revalidateTag(`suppliers:count`);

		// 3. Retour de la réponse de succès
		return createSuccessResponse(
			null,
			`Les fournisseurs ont été rafraîchis avec succès`
		);
	} catch (error) {
		console.error("[REFRESH_SUPPLIERS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de rafraîchir les fournisseurs"
		);
	}
};
