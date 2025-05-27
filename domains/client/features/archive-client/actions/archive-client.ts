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
import { archiveClientSchema } from "../schemas";

export const archiveClient: ServerAction<
	Client,
	typeof archiveClientSchema
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

		// 3. Validation des données
		const validation = archiveClientSchema.safeParse({
			id,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être membre pour effectuer cette action"
			);
		}

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findUnique({
			where: {
				id,
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

		// 6. Vérification que le client n'est pas déjà archivé
		if (existingClient.status === ClientStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce client est déjà archivé"
			);
		}

		// 6.1 Validation de la transition de statut
		const { isValid, message } = validateClientStatusTransition({
			currentStatus: existingClient.status,
			newStatus: ClientStatus.ARCHIVED,
		});

		if (!isValid) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				message || "La transition vers le statut ARCHIVED n'est pas autorisée"
			);
		}

		// 7. Mise à jour du client
		const updatedClient = await db.client.update({
			where: {
				id,
			},
			data: {
				status: ClientStatus.ARCHIVED,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`clients:${id}`);
		revalidateTag(`clients`);

		return createSuccessResponse(
			updatedClient,
			"Le client a été archivé avec succès"
		);
	} catch (error) {
		console.error("[ARCHIVE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage du client"
		);
	}
};
