"use server";

import { auth } from "@/domains/auth";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { refreshMembershipSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir le membership de l'utilisateur connecté
 * Validations :
 * - L'utilisateur doit être authentifié
 */
export const refreshMembership: ServerAction<
	null,
	typeof refreshMembershipSchema
> = async () => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour rafraîchir votre membership"
			);
		}

		// 3. Invalidation des caches pour le membership de l'utilisateur
		revalidateTag(`membership:${session.user.id}`);
		revalidateTag(`membership`);

		// 4. Retour de la réponse de succès
		return createSuccessResponse(
			null,
			`Votre membership a été rafraîchi avec succès`
		);
	} catch (error) {
		console.error("[REFRESH_MEMBERSHIP]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de rafraîchir le membership"
		);
	}
};
