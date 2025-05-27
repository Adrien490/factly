"use server";

import { auth } from "@/domains/auth";
import { checkMembership } from "@/domains/member/features/check-membership";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { refreshClientsSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir les clients
 * Validations :
 * - L'utilisateur doit être authentifié
 */
export const refreshClients: ServerAction<
	null,
	typeof refreshClientsSchema
> = async () => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour rafraîchir les clients"
			);
		}

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être membre pour effectuer cette action"
			);
		}

		// 2. Validation des données avec le schéma Zod
		const validation = refreshClientsSchema.safeParse({});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée"
			);
		}

		revalidateTag(`clients`);
		revalidateTag(`clients:count`);

		// 3. Retour de la réponse de succès
		return createSuccessResponse(
			null,
			`Les clients ont été rafraîchis avec succès`
		);
	} catch (error) {
		console.error("[REFRESH_CLIENTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de rafraîchir les clients"
		);
	}
};
