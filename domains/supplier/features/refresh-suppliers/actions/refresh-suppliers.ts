"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { refreshSuppliersSchema } from "../schemas";

/**
 * Action serveur pour rafraîchir les données des fournisseurs
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export async function refreshSuppliers(
	_: ActionState<null, typeof refreshSuppliersSchema> | null,
	formData: FormData
): Promise<ActionState<null, typeof refreshSuppliersSchema>> {
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
		const validation = refreshSuppliersSchema.safeParse({
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

		// 5. Revalidation des tags pour les fournisseurs
		revalidateTag(`organization:${organizationId}:suppliers`);
		revalidateTag(`organization:${organizationId}:suppliers:count`);

		// 6. Retour de la réponse de succès
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
}
