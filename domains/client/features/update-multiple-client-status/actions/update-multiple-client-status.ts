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
import { updateMultipleClientStatusSchema } from "../schemas/update-multiple-client-status-schema";

export const updateMultipleClientStatus: ServerAction<
	null,
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
		const clientIds = formData.getAll("ids") as string[];
		const status = formData.get("status") as ClientStatus;

		// Vérification que l'organizationId n'est pas vide
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = updateMultipleClientStatusSchema.safeParse({
			ids: clientIds,
			organizationId,
			status,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids: clientIds, organizationId, status },
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 5. Vérification de l'existence des clients
		const existingClients = await db.client.findMany({
			where: {
				id: { in: validation.data.ids },
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
				"Certains clients sont introuvables"
			);
		}

		// Filtrer les clients qui n'ont pas déjà le statut cible
		const clientsToUpdate = existingClients.filter(
			(client) => client.status !== validation.data.status
		);

		if (clientsToUpdate.length === 0) {
			return createSuccessResponse(
				null,
				"Tous les clients sélectionnés ont déjà ce statut"
			);
		}

		// 6. Mise à jour
		await db.client.updateMany({
			where: {
				id: { in: clientsToUpdate.map((client) => client.id) },
				organizationId: validation.data.organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// Revalidation du cache
		revalidateTag(`organization:${organizationId}:clients`);

		return createSuccessResponse(
			null,
			`Le statut de ${clientsToUpdate.length} client(s) a été mis à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_MULTIPLE_CLIENT_STATUS] Error:", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
