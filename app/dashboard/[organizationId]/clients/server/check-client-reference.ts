"use server";

import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { headers } from "next/headers";
import CheckReferenceSchema from "../schemas/check-reference-schema";

type CheckReferenceResponse = {
	reference: string;
	exists: boolean;
};

export default async function checkClientReference(
	_: ServerActionState<
		CheckReferenceResponse,
		typeof CheckReferenceSchema
	> | null,
	formData: FormData
): Promise<
	ServerActionState<CheckReferenceResponse, typeof CheckReferenceSchema>
> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour vérifier une référence"
			);
		}

		const rawData = Object.fromEntries(formData.entries());
		const validation = CheckReferenceSchema.safeParse(rawData);

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
				ServerActionStatus.FORBIDDEN,
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
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Erreur inconnue"
		);
	}
}
