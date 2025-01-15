// actions/clients/create-client.ts
"use server";

import {
	default as ClientFormSchema,
	default as ClientSchema,
} from "@/app/dashboard/[organizationId]/clients/schemas/client-schema";
import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import {
	Civility,
	Client,
	ClientStatus,
	ClientType,
	LegalForm,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

export default async function createClient(
	_: ServerActionState<Client, typeof ClientSchema> | null,
	formData: FormData
): Promise<ServerActionState<Client, typeof ClientSchema>> {
	try {
		console.log("createClient");
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un client"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
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

		// Parse les champs JSON et conversion des types
		try {
			const processedData = {
				...rawData,
				billingAddress: rawData.billingAddress
					? JSON.parse(rawData.billingAddress as string)
					: undefined,
				// Conversion des types spéciaux
				clientType: rawData.clientType as ClientType,
				status: rawData.status as ClientStatus,
				legalForm: rawData.legalForm ? (rawData.legalForm as LegalForm) : null,
				civility: rawData.civility ? (rawData.civility as Civility) : null,
				email: rawData.email || null,
				phone: rawData.phone || null,
				website: rawData.website || null,
				siren: rawData.siren || null,
				siret: rawData.siret || null,
				vatNumber: rawData.vatNumber || null,
			};

			const validation = ClientFormSchema.safeParse(processedData);
			if (!validation.success) {
				console.log(validation.error.flatten().fieldErrors);
				return createValidationErrorResponse(
					validation.error.flatten().fieldErrors,
					processedData,
					"Veuillez corriger les erreurs ci-dessous"
				);
			}

			// 5. Vérification de l'existence de la référence
			const existingClient = await db.client.findFirst({
				where: {
					reference: validation.data.reference,
					organizationId: validation.data.organizationId,
				},
				select: { id: true },
			});

			if (existingClient) {
				return createErrorResponse(
					ServerActionStatus.CONFLICT,
					"Un client avec cette référence existe déjà dans l'organisation"
				);
			}

			// 6. Opérations sur la base de données
			const { organizationId: validatedOrgId, ...clientData } = validation.data;
			const client = await db.client.create({
				data: {
					...clientData,
					user: { connect: { id: session.user.id } },
					organization: { connect: { id: validatedOrgId } },
				},
			});

			// Revalidation du cache
			revalidateTag(`client:${client.id}`);
			revalidateTag(`client:org:${validatedOrgId}:${client.id}`);
			revalidateTag(`clients:org:${validatedOrgId}`);
			revalidateTag("clients:list");

			return createSuccessResponse(
				client,
				`Le client ${client.name} a été créé avec succès`
			);
		} catch (error) {
			console.error("[CREATE_CLIENT]", error);
			return createErrorResponse(
				ServerActionStatus.ERROR,
				error instanceof Error ? error.message : "Impossible de créer le client"
			);
		}
	} catch (error) {
		console.error("[CREATE_CLIENT]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le client"
		);
	}
}
