"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
} from "@/shared/types/server-action";
import { Address } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import deleteAddressSchema from "../schemas/delete-address-schema";
/**
 * Action serveur pour supprimer une adresse
 */
export async function deleteAddress(
	_: ServerActionState<Address, typeof deleteAddressSchema> | null,
	formData: FormData
): Promise<ServerActionState<Address, typeof deleteAddressSchema>> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une adresse"
			);
		}

		const id = formData.get("id");
		if (!id) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"ID de l'adresse requis"
			);
		}

		// Récupérer l'adresse avec les informations du client
		const address = await db.address.findUnique({
			where: { id: id.toString() },
			include: {
				client: {
					select: {
						id: true,
						organizationId: true,
						name: true,
					},
				},
			},
		});

		if (!address || !address.client) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Adresse non trouvée ou client associé inexistant"
			);
		}

		// Vérification que l'utilisateur a accès à l'organisation du client
		const hasAccess = await hasOrganizationAccess(
			address.client.organizationId
		);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette adresse"
			);
		}

		// Stocker les informations nécessaires avant suppression
		const organizationId = address.client.organizationId;
		const clientId = address.client.id;
		const clientName = address.client.name;
		const addressType = address.addressType;

		// Supprimer l'adresse
		const deletedAddress = await db.address.delete({
			where: { id: id.toString() },
		});

		// Revalidation du cache
		revalidatePath(`/dashboard/${organizationId}/clients/${clientId}`);

		return createSuccessResponse(
			deletedAddress,
			`Adresse ${addressType.toLowerCase()} de ${clientName} supprimée avec succès`
		);
	} catch (error) {
		console.error("[DELETE_ADDRESS_ERROR]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Une erreur est survenue lors de la suppression de l'adresse"
		);
	}
}
