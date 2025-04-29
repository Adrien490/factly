"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";

import { hasOrganizationAccess } from "@/domains/organization/features";
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

		// 2. Récupération des données
		const organizationId = formData.get("organizationId") as string;
		const clientIds = formData.getAll("ids") as string[];

		console.log("[DELETE_CLIENTS] Form Data:", {
			ids: clientIds,
			organizationId,
		});

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
		const validation = deleteMultipleClientsSchema.safeParse({
			ids: clientIds,
			organizationId,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids: clientIds, organizationId },
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
			},
		});

		if (existingClients.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Certains clients sont introuvables"
			);
		}

		// 6. Suppression
		await db.client.deleteMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
			},
		});

		// Revalidation du cache
		revalidateTag(`organizations:${organizationId}:clients`);
		validation.data.ids.forEach((clientId) => {
			revalidateTag(`organizations:${organizationId}:client:${clientId}`);
		});
		revalidateTag(`organizations:${organizationId}:clients:count`);

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
