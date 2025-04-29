"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { ClientStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateClientStatusSchema } from "../schemas";

export const updateClientStatus: ServerAction<
	{ id: string; status: ClientStatus },
	typeof updateClientStatusSchema
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
			organizationId: formData.get("organizationId") as string,
			status: formData.get("status") as ClientStatus,
		};

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = updateClientStatusSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
				name: true,
			},
		});

		if (!existingClient) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Client introuvable");
		}

		// Vérification si le statut est le même
		if (existingClient.status === validation.data.status) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Le client a déjà ce statut"
			);
		}

		// 6. Mise à jour du statut
		const updatedClient = await db.client.update({
			where: { id: validation.data.id },
			data: {
				status: validation.data.status,
			},
		});

		// 7. Revalidation du cache
		revalidateTag(`organization:${rawData.organizationId}:clients`);
		revalidateTag(
			`organization:${rawData.organizationId}:client:${existingClient.id}`
		);
		revalidateTag(`organization:${rawData.organizationId}:clients:count`);

		return createSuccessResponse(
			{ id: updatedClient.id, status: updatedClient.status },
			`Statut du client "${existingClient.name}" mis à jour`
		);
	} catch (error) {
		console.error("[UPDATE_CLIENT_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de mettre à jour le statut du client"
		);
	}
};
