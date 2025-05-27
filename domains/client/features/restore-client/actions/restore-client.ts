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
import { restoreClientSchema } from "../schemas";

export const restoreClient: ServerAction<
	Client,
	typeof restoreClientSchema
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
		const validation = restoreClientSchema.safeParse({
			id,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
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
				reference: true,
			},
		});

		if (!existingClient) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le client n'a pas été trouvé"
			);
		}

		// 5. Vérification que le client est bien archivé
		if (existingClient.status !== ClientStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce client n'est pas archivé"
			);
		}

		// 5.1 Validation de la transition de statut
		const validationResult = validateClientStatusTransition({
			currentStatus: existingClient.status,
			newStatus: validation.data.status,
		});

		if (!validationResult.isValid) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				validationResult.message ||
					`La transition de ARCHIVED vers ${validation.data.status} n'est pas autorisée`
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
		const statusText =
			validation.data.status === ClientStatus.ACTIVE
				? "actif"
				: validation.data.status === ClientStatus.LEAD
					? "prospect"
					: validation.data.status === ClientStatus.INACTIVE
						? "inactif"
						: "autre statut";

		const message = `Le client ${existingClient.reference} a été restauré en ${statusText} avec succès`;

		return createSuccessResponse(updatedClient, message);
	} catch (error) {
		console.error("[RESTORE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration du client"
		);
	}
};
