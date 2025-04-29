"use server";

import { auth } from "@/domains/auth";
import { validateClientStatusTransition } from "@/domains/client/utils/validate-client-status-transition";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Client, ClientStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateClientStatusSchema } from "../schemas";

export const updateClientStatus: ServerAction<
	Client,
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

		// 2. Récupération des données
		const id = formData.get("id") as string;
		const organizationId = formData.get("organizationId") as string;
		const status = formData.get("status") as ClientStatus;

		// 3. Validation des données
		const validation = updateClientStatusSchema.safeParse({
			id,
			organizationId,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ id, organizationId, status },
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findUnique({
			where: {
				id,
				organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (!existingClient) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le client n'a pas été trouvé"
			);
		}

		// 6. Validation de la transition de statut
		const transitionValidation = validateClientStatusTransition({
			currentStatus: existingClient.status,
			newStatus: validation.data.status,
		});

		if (!transitionValidation.isValid) {
			return createErrorResponse(
				ActionStatus.ERROR,
				transitionValidation.message || "Transition de statut non autorisée"
			);
		}

		// 7. Mise à jour du client
		const updatedClient = await db.client.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organization:${organizationId}:client:${id}`);
		revalidateTag(`organization:${organizationId}:clients`);

		// 9. Message de succès personnalisé
		const message =
			validation.data.status === ClientStatus.ARCHIVED
				? "Le client a été archivé avec succès"
				: existingClient.status === ClientStatus.ARCHIVED
				? "Le client a été restauré avec succès"
				: "Le statut du client a été mis à jour avec succès";

		return createSuccessResponse(updatedClient, message);
	} catch (error) {
		console.error("[UPDATE_CLIENT_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
