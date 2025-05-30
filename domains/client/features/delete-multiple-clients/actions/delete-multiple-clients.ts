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
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteMultipleClientsSchema } from "../schemas";

export const deleteMultipleClients: ServerAction<
	null,
	typeof deleteMultipleClientsSchema
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
		const clientIds = formData.getAll("ids") as string[];

		console.log("[DELETE_CLIENTS] Form Data:", {
			ids: clientIds,
		});

		// 3. Validation complète des données
		const validation = deleteMultipleClientsSchema.safeParse({
			ids: clientIds,
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
				id: { in: validation.data.ids },
			},
			select: {
				id: true,
			},
		});

		if (existingClients.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Certains clients sont introuvables"
			);
		}

		// 5. Suppression
		await db.client.deleteMany({
			where: {
				id: { in: validation.data.ids },
			},
		});

		// Revalidation du cache
		revalidateTag(`clients`);
		validation.data.ids.forEach((clientId) => {
			revalidateTag(`clients:${clientId}`);
		});
		revalidateTag(`clients:count`);

		return createSuccessResponse(
			null,
			`${validation.data.ids.length} client(s) supprimé(s) définitivement`
		);
	} catch (error) {
		console.error("[DELETE_MULTIPLE_CLIENTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer les clients sélectionnés"
		);
	}
};
