"use server";

import { auth } from "@/domains/auth";
import { validateClientStatusTransition } from "@/domains/client/utils/validate-client-status-transition";
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
import { restoreMultipleClientsSchema } from "../schemas/restore-multiple-clients-schema";

export const restoreMultipleClients: ServerAction<
	Client[],
	typeof restoreMultipleClientsSchema
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
		const ids = formData.getAll("ids") as string[];
		const status = formData.get("status") as ClientStatus;

		// 3. Validation des données
		const validation = restoreMultipleClientsSchema.safeParse({
			ids,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'existence des clients
		const existingClients = await db.client.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
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

		// 5. Filtrer les clients qui sont actuellement archivés
		const clientsToRestore = existingClients.filter(
			(client) => client.status === ClientStatus.ARCHIVED
		);

		if (clientsToRestore.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Aucun des clients sélectionnés n'est archivé"
			);
		}

		// 5.1 Vérifier les transitions de statut pour chaque client
		const invalidTransitions = clientsToRestore
			.map((client) => {
				const validationResult = validateClientStatusTransition({
					currentStatus: client.status,
					newStatus: validation.data.status,
				});
				return {
					clientId: client.id,
					isValid: validationResult.isValid,
					message: validationResult.message,
				};
			})
			.filter((result) => !result.isValid);

		if (invalidTransitions.length > 0) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				`La transition de ARCHIVED vers ${validation.data.status} n'est pas autorisée pour ${invalidTransitions.length} client(s)`
			);
		}

		// 6. Mise à jour des clients avec le statut spécifié
		await db.client.updateMany({
			where: {
				id: {
					in: clientsToRestore.map((client) => client.id),
				},
			},
			data: {
				status: validation.data.status,
			},
		});

		// Récupération des clients mis à jour
		const updatedClients = await db.client.findMany({
			where: {
				id: {
					in: clientsToRestore.map((client) => client.id),
				},
			},
		});

		// 7. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`clients:${id}`);
		}
		revalidateTag(`clients`);

		// 8. Message de succès personnalisé
		const statusText =
			validation.data.status === ClientStatus.ACTIVE
				? "actif"
				: validation.data.status === ClientStatus.LEAD
					? "prospect"
					: validation.data.status === ClientStatus.INACTIVE
						? "inactif"
						: "autre statut";

		const message = `${clientsToRestore.length} client(s) ont été restauré(s) en ${statusText} avec succès`;

		return createSuccessResponse(updatedClients, message, {
			restoredClientIds: clientsToRestore.map((client) => client.id),
		});
	} catch (error) {
		console.error("[RESTORE_MULTIPLE_CLIENTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration des clients"
		);
	}
};
