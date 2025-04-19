"use server";

import { auth } from "@/domains/auth";
import {
	getOrganization,
	hasOrganizationAccess,
} from "@/domains/organization/features";
import { GetOrganizationReturn } from "@/domains/organization/features/get-organization";
import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { refreshClientsSchema } from "../schemas";

/**
 * Action serveur pour créer un nouveau client
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La référence du client doit être unique dans l'organisation
 */
export async function refreshClients(
	_: ActionState<GetOrganizationReturn, typeof refreshClientsSchema> | null,
	formData: FormData
): Promise<ActionState<GetOrganizationReturn, typeof refreshClientsSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un client"
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

		// 5. Validation des données avec le schéma Zod
		const validation = refreshClientsSchema.safeParse({
			organizationId,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				null,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		const organization = await getOrganization(organizationId);

		if (!organization) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"L'organisation n'existe pas"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		revalidateTag(`organization:${organizationId}:clients`);
		revalidateTag(`organization:${organizationId}:clients:count`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			organization,
			`Les clients ont été rafraîchis avec succès`
		);
	} catch (error) {
		console.error("[CREATE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le client"
		);
	}
}
