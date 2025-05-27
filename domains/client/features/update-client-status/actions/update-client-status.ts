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
		const status = formData.get("status") as ClientStatus;

		// 3. Validation des données
		const validation = updateClientStatusSchema.safeParse({
			id,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
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

		// 4. Vérification de l'existence du client
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

		// 5. Validation de la transition de statut
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

		// 6. Mise à jour du client
		const updatedClient = await db.client.update({
			where: {
				id,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 7. Invalidation du cache
		revalidateTag(`clients:${id}`);
		revalidateTag(`clients`);

		// 8. Message de succès personnalisé
		const message =
			validation.data.status === ClientStatus.ARCHIVED
				? "Le client a été archivé avec succès"
				: existingClient.status === ClientStatus.ARCHIVED
					? `Le client ${updatedClient.reference} a été restauré avec succès`
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
