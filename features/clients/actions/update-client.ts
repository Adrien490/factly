"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Client } from "@prisma/client";
import { headers } from "next/headers";
import ClientSchema from "../schemas/create-client-schema";
import updateClientSchema from "../schemas/update-client-schema";

export default async function updateClient(
	_: ServerActionState<Client, typeof updateClientSchema> | undefined,
	formData: FormData
) {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un client"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const clientId = formData.get("id");
		if (!organizationId || !clientId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation et l'ID du client sont requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const rawData = Object.fromEntries(formData.entries());
		const validation = ClientSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findFirst({
			where: {
				id: clientId.toString(),
				organizationId: organizationId.toString(),
			},
		});

		if (!existingClient) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Client introuvable"
			);
		}

		// 6. Vérification de l'unicité de la référence
		const existingReference = await db.client.findFirst({
			where: {
				reference: validation.data.reference as string,
				organizationId: validation.data.organizationId as string,
				id: { not: clientId.toString() },
			},
			select: { id: true },
		});

		if (existingReference) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Un client avec cette référence existe déjà dans l'organisation"
			);
		}

		// 7. Mise à jour du client
		const clientData = validation.data;
		const client = await db.client.update({
			where: { id: clientId.toString() },
			data: clientData as Client,
		});

		return createSuccessResponse(client, "Client modifié avec succès");
	} catch (error) {
		console.error("[EDIT_CLIENT]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le client"
		);
	}
}
