"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";

import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Client } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteClientSchema } from "../schemas";

export const deleteClient: ServerAction<
	Client,
	typeof deleteClientSchema
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

		console.log(formData);

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
		};

		console.log("[DELETE_CLIENT] Form Data:", {
			id: rawData.id,
			organizationId: rawData.organizationId,
		});

		// Vérification que l'organizationId n'est pas vide
		if (!rawData.organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteClientSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
		});

		if (!existingClient) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Client introuvable");
		}

		// 6. Suppression
		await db.client.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les mêmes tags que get-clients
		revalidateTag(`organizations:${rawData.organizationId}:clients`);
		revalidateTag(
			`organizations:${rawData.organizationId}:clients:${existingClient.id}`
		);
		revalidateTag(`organizations:${rawData.organizationId}:clients:count`);

		return createSuccessResponse(
			existingClient,
			`Client "${existingClient.reference}" supprimé définitivement`
		);
	} catch (error) {
		console.error("[HARD_DELETE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer définitivement le client"
		);
	}
};
