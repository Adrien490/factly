"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";

import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types";
import { Client, ClientStatus, ClientType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateClientSchema } from "../schemas";

/**
 * Action serveur pour créer un nouveau client
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La référence du client doit être unique dans l'organisation
 */
export async function updateClient(
	_: ActionState<Client, typeof updateClientSchema> | null,
	formData: FormData
): Promise<ActionState<Client, typeof updateClientSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un client"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			id: formData.get("id") as string,
			organizationId: organizationId.toString(),
			name: formData.get("name") as string,
			reference: formData.get("reference") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			website: formData.get("website") as string,
			siren: formData.get("siren") as string,
			siret: formData.get("siret") as string,
			clientType: formData.get("clientType") as ClientType,
			status: formData.get("status") as ClientStatus,
			notes: formData.get("notes") as string,
			userId: session.user.id,
			vatNumber: formData.get("vatNumber") as string,
		};

		console.log("[CREATE_CLIENT] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = updateClientSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_CLIENT] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de l'existence de la référence
		const existingClient = await db.client.findFirst({
			where: {
				reference: validation.data.reference,
				organizationId: validation.data.organizationId,
				id: {
					not: validation.data.id,
				},
			},
			select: { id: true },
		});

		if (existingClient) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Un client avec cette référence existe déjà dans l'organisation",
				rawData
			);
		}

		// 7. Création du client dans la base de données
		const { ...clientData } = validation.data;

		// Créer le client avec les relations appropriées
		const client = await db.client.update({
			where: { id: clientData.id },
			data: clientData,
		});
		revalidateTag(
			`organization:${clientData.organizationId}:client:${clientData.id}`
		);
		revalidateTag(`organization:${clientData.organizationId}:clients`);
		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			client,
			`Le client ${client.name} a été modifié avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[UPDATE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le client"
		);
	}
}
