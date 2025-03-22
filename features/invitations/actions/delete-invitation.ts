"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Invitation } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import DeleteInvitationSchema from "../schemas/delete-invitation-schema";

interface DeleteInvitationResult {
	invitation: Invitation;
	message: string;
}

export default async function deleteInvitation(
	previous: ServerActionState<
		DeleteInvitationResult,
		typeof DeleteInvitationSchema
	> | null,
	formData: FormData
): Promise<
	ServerActionState<DeleteInvitationResult, typeof DeleteInvitationSchema>
> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une invitation"
			);
		}

		// 2. Validation des données
		const rawData = {
			id: formData.get("id"),
			organizationId: formData.get("organizationId"),
		};

		const validation = DeleteInvitationSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// 3. Vérification des droits sur l'organisation
		const hasAccess = await hasOrganizationAccess(
			validation.data.organizationId
		);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas les droits pour supprimer des invitations dans cette organisation"
			);
		}

		// 4. Vérification de l'existence de l'invitation
		const invitation = await db.invitation.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
		});

		if (!invitation) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"L'invitation n'existe pas"
			);
		}

		// 5. Suppression de l'invitation
		const deletedInvitation = await db.invitation.delete({
			where: {
				id: invitation.id,
			},
		});

		revalidateTag(`organization:${invitation.organizationId}`);

		return createSuccessResponse(
			{
				invitation: deletedInvitation,
				message: "L'invitation a été supprimée avec succès",
			},
			"L'invitation a été supprimée avec succès"
		);
	} catch (error) {
		console.error("[DELETE_INVITATION]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer l'invitation"
		);
	}
}
