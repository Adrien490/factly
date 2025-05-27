"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";

import { checkMembership } from "@/domains/member/features/check-membership";
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

		console.log(formData);

		// 2. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
		};

		console.log("[DELETE_CLIENT] Form Data:", {
			id: rawData.id,
		});

		// 3. Validation complète des données
		const validation = deleteClientSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 4. Vérification de l'existence du client
		const existingClient = await db.client.findFirst({
			where: {
				id: validation.data.id,
			},
		});

		if (!existingClient) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Client introuvable");
		}

		// 5. Suppression
		await db.client.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les mêmes tags que get-clients
		revalidateTag(`clients`);
		revalidateTag(`clients:count`);

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
