"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Organization, OrganizationStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { softDeleteOrganizationSchema } from "../schemas/soft-delete-organization-schema";

export const softDeleteOrganization: ServerAction<
	Organization,
	typeof softDeleteOrganizationSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			confirmation: formData.get("confirmation") as string,
		};

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.id);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = softDeleteOrganizationSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(
				"[SOFT_DELETE_ORGANIZATION] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence de l'organisation
		const existingOrganization = await db.organization.findFirst({
			where: {
				id: validation.data.id,
			},
		});

		if (!existingOrganization) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Organisation introuvable"
			);
		}

		// 6. Mise à jour du statut
		const organization = await db.organization.update({
			where: { id: validation.data.id },
			data: {
				status: OrganizationStatus.DELETED,
			},
		});

		// 7. Revalidation du cache
		revalidateTag(`organizations:${organization.id}`);
		revalidateTag("organizations");

		redirect("/dashboard");
	} catch (error) {
		console.error("[SOFT_DELETE_ORGANIZATION]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer l'organisation"
		);
	}
};
