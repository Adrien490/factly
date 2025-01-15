"use server";

import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/lib/auth";
import {
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerActionState,
	ServerActionStatus,
} from "@/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import refreshClientsSchema from "../schemas/refresh-clients-schema";

export default async function refreshClients(
	_: ServerActionState<null, typeof refreshClientsSchema> | null,
	formData: FormData
): Promise<ServerActionState<null, typeof refreshClientsSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		const rawOrganizationId = formData.get("organizationId");

		const validation = refreshClientsSchema.safeParse(rawOrganizationId);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawOrganizationId,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const hasAccess = await hasOrganizationAccess(
			validation.data.organizationId
		);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		revalidateTag("client-list");
		revalidateTag(`org-${validation.data.organizationId}-clients`);

		// Log de revalidation
		return createSuccessResponse(null, "Clients actualisés avec succès");
	} catch (error) {
		console.error(error);
		return createErrorResponse(
			ServerActionStatus.UNAUTHORIZED,
			"Vous devez être connecté pour effectuer cette action"
		);
	}

	// Tags globaux
}
