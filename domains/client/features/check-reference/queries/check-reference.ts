"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { headers } from "next/headers";
import { checkReferenceSchema } from "../schemas";
import { CheckReferenceResponse } from "../types";

export async function checkReference(
	_: ActionState<unknown, typeof checkReferenceSchema> | null,
	formData: FormData
): Promise<ActionState<CheckReferenceResponse, typeof checkReferenceSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour vérifier une référence"
			);
		}

		const rawData = Object.fromEntries(formData.entries());
		const validation = checkReferenceSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const { reference, organizationId } = validation.data;

		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		const existingClient = await db.client.findFirst({
			where: {
				reference,
				organizationId,
			},
			select: {
				id: true,
			},
		});

		return createSuccessResponse(
			{
				reference,
				exists: !!existingClient,
			},
			"Référence vérifiée avec succès"
		);
	} catch (error) {
		console.error("[CHECK_CLIENT_REFERENCE]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Erreur inconnue"
		);
	}
}
