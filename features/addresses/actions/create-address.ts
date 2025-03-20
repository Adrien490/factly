"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Address } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAddressSchema } from "../schemas/address-schema";

/**
 * Action serveur pour créer une nouvelle adresse
 */
export async function createAddress(
	_: ServerActionState<Address, typeof createAddressSchema> | null,
	formData: FormData
): Promise<ServerActionState<Address, typeof createAddressSchema>> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une adresse"
			);
		}

		// Extraction et validation des données du formulaire
		const rawData = Object.fromEntries(formData.entries());

		// Conversion de certains champs si nécessaire
		const parsedData = {
			...rawData,
			isDefault: rawData.isDefault === "true" || rawData.isDefault === "on",
			latitude: rawData.latitude
				? parseFloat(rawData.latitude as string)
				: null,
			longitude: rawData.longitude
				? parseFloat(rawData.longitude as string)
				: null,
		};

		const validation = createAddressSchema.safeParse(parsedData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				parsedData,
				"Veuillez corriger les erreurs dans le formulaire"
			);
		}

		const { clientId, ...addressData } = validation.data;

		// Vérification que le client existe et appartient à l'organisation de l'utilisateur
		const client = await db.client.findUnique({
			where: { id: clientId },
			select: {
				id: true,
				organizationId: true,
				name: true,
			},
		});

		if (!client) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Client non trouvé"
			);
		}

		// Vérification que l'utilisateur a accès à l'organisation du client
		const hasAccess = await hasOrganizationAccess(client.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à ce client"
			);
		}

		// Si cette adresse est définie par défaut, mettre à jour les autres adresses du même type
		if (addressData.isDefault) {
			await db.address.updateMany({
				where: {
					clientId,
					addressType: addressData.addressType,
					isDefault: true,
				},
				data: {
					isDefault: false,
				},
			});
		}

		// Création de l'adresse
		const address = await db.address.create({
			data: {
				...addressData,
				client: { connect: { id: clientId } },
			},
		});

		// Revalidation du cache
		revalidatePath(`/dashboard/${client.organizationId}/clients/${clientId}`);

		return createSuccessResponse(
			address,
			`Adresse créée avec succès pour ${client.name}`
		);
	} catch (error) {
		console.error("[CREATE_ADDRESS_ERROR]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Une erreur est survenue lors de la création de l'adresse"
		);
	}
}
