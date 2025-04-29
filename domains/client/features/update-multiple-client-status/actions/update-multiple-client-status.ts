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
} from "@/shared/types";
import { Client, ClientStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateMultipleClientStatusSchema } from "../schemas/update-multiple-client-status-schema";

export const updateMultipleClientStatus: ServerAction<
	Client[],
	typeof updateMultipleClientStatusSchema
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
		const organizationId = formData.get("organizationId") as string;
		const ids = formData.getAll("ids") as string[];
		const status = formData.get("status") as ClientStatus;

		// 3. Validation des données
		const validation = updateMultipleClientStatusSchema.safeParse({
			ids,
			organizationId,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids, organizationId, status },
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

		// 5. Vérification de l'existence des clients
		const existingClients = await db.client.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (existingClients.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Un ou plusieurs clients n'ont pas été trouvés"
			);
		}

		// 6. Validation des transitions de statut
		for (const client of existingClients) {
			const transitionValidation = validateClientStatusTransition({
				currentStatus: client.status,
				newStatus: validation.data.status,
			});

			if (!transitionValidation.isValid) {
				return createErrorResponse(
					ActionStatus.ERROR,
					transitionValidation.message || "Transition de statut non autorisée"
				);
			}
		}

		// 7. Mise à jour des clients
		await db.client.updateMany({
			where: {
				id: {
					in: validation.data.ids,
				},
				organizationId: validation.data.organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// Récupération des clients mis à jour
		const updatedClients = await db.client.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
				organizationId: validation.data.organizationId,
			},
		});

		// 8. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`organization:${organizationId}:client:${id}`);
		}
		revalidateTag(`organization:${organizationId}:clients`);

		// 9. Message de succès personnalisé
		const message =
			validation.data.status === ClientStatus.ARCHIVED
				? "Les clients ont été archivés avec succès"
				: existingClients.some(
						(client) => client.status === ClientStatus.ARCHIVED
				  )
				? `${existingClients.length} clients ont été restaurés avec succès`
				: "Le statut des clients a été mis à jour avec succès";

		return createSuccessResponse(updatedClients, message);
	} catch (error) {
		console.error("[UPDATE_MULTIPLE_CLIENT_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
