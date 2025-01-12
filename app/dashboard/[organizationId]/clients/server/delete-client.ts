"use server";

import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/auth";
import db from "@/lib/db";

import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { revalidateTag } from "next/cache";
import deleteClientSchema from "../schemas/delete-client-schema";

export default async function deleteClient(
	_: ServerActionState<null, typeof deleteClientSchema> | null,
	formData: FormData
): Promise<ServerActionState<null, typeof deleteClientSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth();
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		console.log(formData);

		// 2. Vérification de base des données requises
		const rawId = formData.get("id");
		const rawOrganizationId = formData.get("organizationId");
		if (
			!rawId ||
			typeof rawId !== "string" ||
			!rawOrganizationId ||
			typeof rawOrganizationId !== "string"
		) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'identifiant du client et de l'organisation sont requis"
			);
		}

		console.log(rawOrganizationId);

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawOrganizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		console.log("rawOrganizationId", rawOrganizationId);
		console.log("rawId", rawId);

		// 4. Validation complète des données
		const validation = deleteClientSchema.safeParse({
			id: rawId,
			organizationId: rawOrganizationId,
		});
		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ rawId, rawOrganizationId },
				"Types invalides"
			);
		}

		console.log(validation.data);
		console.log(validation.data);

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (!existingClient) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Client introuvable"
			);
		}

		// 6. Suppression
		await db.client.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les mêmes tags que get-clients
		revalidateTag(`clients:org:${rawOrganizationId}`);
		revalidateTag(`clients:org:${rawOrganizationId}:${existingClient.status}`);
		revalidateTag("clients:list");

		return createSuccessResponse(null, "Client supprimé définitivement");
	} catch (error) {
		console.error("[HARD_DELETE_CLIENT]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Impossible de supprimer définitivement le client"
		);
	}
}
