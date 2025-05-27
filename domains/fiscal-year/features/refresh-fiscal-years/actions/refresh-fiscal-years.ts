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
import { refreshFiscalYearsSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir les années fiscales
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export const refreshFiscalYears: ServerAction<
	null,
	typeof refreshFiscalYearsSchema
> = async () => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour rafraîchir les années fiscales"
			);
		}

		// 5. Révalidation des tags pour forcer le rafraîchissement des données
		revalidateTag(`fiscal-years`);
		revalidateTag(`fiscal-years:count`);

		// 6. Retour de la réponse de succès
		return createSuccessResponse(
			null,
			`Les années fiscales ont été rafraîchies avec succès`
		);
	} catch (error) {
		console.error("[REFRESH_FISCAL_YEARS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de rafraîchir les années fiscales"
		);
	}
};
