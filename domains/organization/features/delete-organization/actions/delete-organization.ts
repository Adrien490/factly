"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteOrganizationSchema } from "../schemas";

/**
 * Action serveur pour supprimer une organisation
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export const deleteOrganization: ServerAction<
	Organization,
	typeof deleteOrganizationSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une organisation"
			);
		}

		// 2. Récupération de l'ID de l'organisation
		const organizationId = formData.get("id");
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Récupération de l'organisation
		const organization = await db.organization.findUnique({
			where: { id: organizationId.toString() },
		});

		if (!organization) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"L'organisation n'existe pas"
			);
		}

		// 5. Suppression de l'organisation
		await db.organization.delete({
			where: { id: organizationId.toString() },
		});

		revalidateTag(`organizations`);
		revalidateTag(`organizations:${organization.id}`);
		revalidateTag(`organizations:${organization.id}:user:${session.user.id}`);

		// 6. Retour de la réponse de succès
		return createSuccessResponse(
			organization,
			`L'organisation a été supprimée avec succès`
		);
	} catch (error) {
		console.error("[DELETE_ORGANIZATION]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer l'organisation"
		);
	}
};
