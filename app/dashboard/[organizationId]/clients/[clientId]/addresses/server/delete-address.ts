"use server";

import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
} from "@/types/server-action";
import { Address } from "@prisma/client";
import { revalidateTag } from "next/cache";
import deleteAddressSchema from "../schemas/delete-address-schema";

export default async function deleteAddress(
	_: ServerActionState<Address, typeof deleteAddressSchema> | null,
	formData: FormData
): Promise<ServerActionState<Address, typeof deleteAddressSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth();
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une adresse"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const clientId = formData.get("clientId");
		const addressId = formData.get("id");
		if (!organizationId || !clientId || !addressId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation, l'ID du client et l'ID de l'adresse sont requis"
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
		const validation = deleteAddressSchema.safeParse({
			id: addressId,
			clientId,
			organizationId,
		});
		if (!validation.success) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"Format des identifiants invalide"
			);
		}

		// 5. Vérification de l'existence de l'adresse
		const existingAddress = await db.address.findFirst({
			where: {
				id: addressId.toString(),
				clientId: clientId.toString(),
				client: {
					organizationId: organizationId.toString(),
				},
			},
		});

		if (!existingAddress) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Adresse introuvable"
			);
		}

		// 6. Suppression de l'adresse
		const address = await db.address.delete({
			where: { id: addressId.toString() },
		});

		// Revalidation du cache
		revalidateTag(`address:${address.id}`);
		revalidateTag(`address:client:${clientId}:${address.id}`);
		revalidateTag(`addresses:client:${clientId}`);
		revalidateTag("addresses:list");

		return createSuccessResponse(
			address,
			"L'adresse a été supprimée avec succès"
		);
	} catch (error) {
		console.error("[DELETE_ADDRESS]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer l'adresse"
		);
	}
}
