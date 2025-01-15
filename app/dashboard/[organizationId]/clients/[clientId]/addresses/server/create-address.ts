"use server";

import AddressSchema from "@/app/dashboard/[organizationId]/clients/[clientId]/addresses/schemas/address-schema";
import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

export default async function createAddress(_: unknown, formData: FormData) {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une adresse"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const clientId = formData.get("clientId");
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
		const validation = AddressSchema.safeParse(rawData);
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
			select: { id: true },
		});

		if (!existingClient) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Client introuvable"
			);
		}

		// 6. Si l'adresse est définie comme par défaut, mettre à jour les autres adresses du même type
		if (validation.data.isDefault) {
			await db.address.updateMany({
				where: {
					clientId: clientId.toString(),
					addressType: validation.data.addressType,
					isDefault: true,
				},
				data: {
					isDefault: false,
				},
			});
		}

		// 7. Création de l'adresse
		const address = await db.address.create({
			data: {
				...validation.data,
				client: { connect: { id: clientId.toString() } },
			},
		});

		// Revalidation du cache
		revalidateTag(`address:${address.id}`);
		revalidateTag(`address:client:${clientId}:${address.id}`);
		revalidateTag(`addresses:client:${clientId}`);
		revalidateTag("addresses:list");

		return createSuccessResponse(address, "L'adresse a été créée avec succès");
	} catch (error) {
		console.error("[CREATE_ADDRESS]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer l'adresse"
		);
	}
}
