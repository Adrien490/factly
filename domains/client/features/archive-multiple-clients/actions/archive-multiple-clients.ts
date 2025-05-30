"use server";

import { auth } from "@/domains/auth";
import { validateClientStatusTransition } from "@/domains/client/utils/validate-client-status-transition";
import { checkMembership } from "@/domains/member/features/check-membership";
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
import { archiveMultipleClientsSchema } from "../schemas/archive-multiple-clients-schema";

export const archiveMultipleClients: ServerAction<
	Client[],
	typeof archiveMultipleClientsSchema
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

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être membre pour effectuer cette action"
			);
		}

		// 2. Récupération des données
		const ids = formData.getAll("ids") as string[];

		// 3. Validation des données
		const validation = archiveMultipleClientsSchema.safeParse({
			ids,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 5. Vérification de l'existence des clients
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

		// 6. Filtrer les clients qui ne sont pas déjà archivés
		const clientsToArchive = existingClients.filter(
			(client) => client.status !== ClientStatus.ARCHIVED
		);

		if (clientsToArchive.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Tous les clients sélectionnés sont déjà archivés"
			);
		}

		// 6.1 Vérifier les transitions de statut pour chaque client
		const invalidTransitions = clientsToArchive
			.map((client) => {
				const { isValid, message } = validateClientStatusTransition({
					currentStatus: client.status,
					newStatus: ClientStatus.ARCHIVED,
				});
				return { clientId: client.id, isValid, message };
			})
			.filter((result) => !result.isValid);

		if (invalidTransitions.length > 0) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				`La transition vers ARCHIVED n'est pas autorisée pour ${invalidTransitions.length} client(s)`
			);
		}

		// 7. Mise à jour des clients
		await db.client.updateMany({
			where: {
				id: {
					in: clientsToArchive.map((client) => client.id),
				},
			},
			data: {
				status: ClientStatus.ARCHIVED,
			},
		});

		// Récupération des clients mis à jour
		const updatedClients = await db.client.findMany({
			where: {
				id: {
					in: clientsToArchive.map((client) => client.id),
				},
			},
		});

		// 8. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`clients:${id}`);
		}
		revalidateTag(`clients`);

		// 9. Message de succès personnalisé
		const message = `${clientsToArchive.length} client(s) ont été archivé(s) avec succès`;

		return createSuccessResponse(updatedClients, message);
	} catch (error) {
		console.error("[ARCHIVE_MULTIPLE_CLIENTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage des clients"
		);
	}
};
