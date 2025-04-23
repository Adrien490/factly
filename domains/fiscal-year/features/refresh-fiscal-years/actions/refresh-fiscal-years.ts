"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
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
> = async (_, formData) => {
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

		const rawData = {
			organizationId: formData.get("organizationId")?.toString(),
		};

		const { organizationId } = rawData;

		// 2. Vérification de base des données requises
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Validation des données avec le schéma Zod
		const validation = refreshFiscalYearsSchema.safeParse({
			organizationId,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				null,
				"Veuillez remplir tous les champs obligatoires"
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

		// 5. Révalidation des tags pour forcer le rafraîchissement des données
		revalidateTag(`organization:${organizationId}:fiscal-years`);
		revalidateTag(`organization:${organizationId}:fiscal-years:count`);

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
