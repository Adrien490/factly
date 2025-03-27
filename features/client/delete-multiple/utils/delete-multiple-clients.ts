"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/features/shared/lib/db";

import { hasOrganizationAccess } from "@/features/organization/has-access";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/features/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteMultipleClientsSchema } from "../schemas";

export async function deleteMultipleClients(
	_: ServerActionState<unknown, typeof deleteMultipleClientsSchema>,
	formData: FormData
): Promise<ServerActionState<null, typeof deleteMultipleClientsSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Vérification de base des données requises
		const rawIds = formData.getAll("ids");
		const rawOrganizationId = formData.get("organizationId");

		if (
			!rawIds.length ||
			!rawOrganizationId ||
			typeof rawOrganizationId !== "string"
		) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"Les identifiants des clients et de l'organisation sont requis"
			);
		}

		// Convert FormData entries to string array
		const ids = rawIds.map((id) => id.toString());

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawOrganizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteMultipleClientsSchema.safeParse({
			ids: ids,
			organizationId: rawOrganizationId,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids, organizationId: rawOrganizationId },
				"Types invalides"
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
				ServerActionStatus.NOT_FOUND,
				"Certains clients sont introuvables"
			);
		}

		// 6. Suppression multiple
		const result = await db.client.deleteMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
			},
		});

		// Revalidation du cache
		revalidateTag(`clients:org:${rawOrganizationId}`);

		// Revalidation pour chaque statut de client
		const statuses = [
			...new Set(existingClients.map((client) => client.status)),
		];
		statuses.forEach((status) => {
			revalidateTag(`clients:org:${rawOrganizationId}:${status}`);
		});

		revalidateTag("clients:list");

		// Revalidation pour chaque client individuel
		existingClients.forEach((client) => {
			revalidateTag(`client:${client.id}`);
			revalidateTag(`client:org:${rawOrganizationId}:${client.id}`);
		});

		return createSuccessResponse(
			null,
			`${result.count} client${result.count > 1 ? "s" : ""} supprimé${
				result.count > 1 ? "s" : ""
			} définitivement`
		);
	} catch (error) {
		console.error("[HARD_DELETE_MULTIPLE_CLIENTS]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Impossible de supprimer définitivement les clients"
		);
	}
}
