"use server";

import ClientFormSchema from "@/app/dashboard/[organizationId]/clients/schemas/client-schema";
import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Client, ClientStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function editClient(
	_: ServerActionState<Client, typeof ClientFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Client, typeof ClientFormSchema>> {
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
		const validation = ClientFormSchema.safeParse(rawData);
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
				reference: validation.data.reference,
				organizationId: validation.data.organizationId,
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
		const { organizationId: validatedOrgId, ...clientData } = validation.data;
		const client = await db.client.update({
			where: { id: clientId.toString() },
			data: clientData,
		});

		// Revalidation du cache
		revalidateTag(`client:${client.id}`);
		revalidateTag(`client:org:${validatedOrgId}:${client.id}`);
		revalidateTag(`clients:org:${validatedOrgId}`);
		revalidateTag(
			`clients:org:${validatedOrgId}:${
				client.status === ClientStatus.ARCHIVED ? "archived" : "active"
			}`
		);
		revalidateTag("clients:list");

		redirect(`/dashboard/${organizationId}/clients/${client.id}`);
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
