"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Organization } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import deleteOrganizationFormSchema from "../schemas/delete-organization-form-schema";

export default async function deleteOrganization(
	previous: ServerActionState<
		Organization,
		typeof deleteOrganizationFormSchema
	> | null,
	formData: FormData
): Promise<
	ServerActionState<Organization, typeof deleteOrganizationFormSchema>
> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une organisation"
			);
		}

		// Récupération de l'ID de l'organisation
		const rawData = {
			id: formData.get("id"),
			confirm: formData.get("confirm"),
		};

		const validation = deleteOrganizationFormSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// Vérification que l'utilisateur est propriétaire de l'organisation
		const organization = await db.organization.findFirst({
			where: {
				id: validation.data.id,
				members: {
					some: {
						userId: session.user.id,
						role: "OWNER",
					},
				},
			},
		});

		if (!organization) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous n'avez pas les droits pour supprimer cette organisation"
			);
		}

		// Vérification du nom de confirmation
		if (validation.data.confirm !== organization.name) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"Le nom de confirmation ne correspond pas"
			);
		}

		// Suppression de l'organisation et de toutes ses données associées
		await db.organization.delete({
			where: {
				id: organization.id,
			},
		});

		revalidateTag("organizations");
		revalidateTag(`user-${session.user.id}-organizations`);

		return createSuccessResponse(
			organization,
			"L'organisation a été supprimée avec succès"
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
