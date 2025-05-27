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
import { refreshMembersSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir les membres et le membership
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit être membre
 */
export const refreshMembers: ServerAction<
	null,
	typeof refreshMembersSchema
> = async () => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour rafraîchir les membres"
			);
		}

		// 3. Validation des données avec le schéma Zod
		const validation = refreshMembersSchema.safeParse({});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée"
			);
		}

		// 4. Invalidation des caches pour les membres et le membership
		revalidateTag(`members`);
		revalidateTag(`members:count`);
		revalidateTag(`membership:${session.user.id}`);
		revalidateTag(`membership`);

		// 5. Retour de la réponse de succès
		return createSuccessResponse(
			null,
			`Les membres ont été rafraîchis avec succès`
		);
	} catch (error) {
		console.error("[REFRESH_MEMBERS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de rafraîchir les membres"
		);
	}
};
