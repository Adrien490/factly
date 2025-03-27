"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/features/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
} from "@/features/shared/types/server-action";
import { Organization } from "@prisma/client";
import { headers } from "next/headers";
import { hasOrganizationAccess } from "../../has-access";
import { deleteOrganizationSchema } from "../schemas";

/**
 * Action serveur pour supprimer une organisation
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export async function deleteOrganization(
	_: ServerActionState<Organization, typeof deleteOrganizationSchema>,
	formData: FormData
): Promise<ServerActionState<Organization, typeof deleteOrganizationSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une organisation"
			);
		}

		// 2. Récupération de l'ID de l'organisation
		const organizationId = formData.get("id");
		if (!organizationId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Récupération de l'organisation
		const organization = await db.organization.findUnique({
			where: { id: organizationId.toString() },
		});

		if (!organization) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"L'organisation n'existe pas"
			);
		}

		// 5. Suppression de l'organisation
		await db.organization.delete({
			where: { id: organizationId.toString() },
		});

		// 6. Retour de la réponse de succès
		return createSuccessResponse(
			organization,
			`L'organisation ${organization.name} a été supprimée avec succès`
		);
	} catch (error) {
		console.error("[DELETE_ORGANIZATION]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer l'organisation"
		);
	}
}
