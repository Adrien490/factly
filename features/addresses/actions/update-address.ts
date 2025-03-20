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
import { headers } from "next/headers";
import { updateAddressSchema } from "../schemas/address-schema";

/**
 * Action serveur pour mettre à jour une adresse existante
 */
export async function updateAddress(
	_: ServerActionState<Address, typeof updateAddressSchema> | null,
	formData: FormData
): Promise<ServerActionState<Address, typeof updateAddressSchema>> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier une adresse"
			);
		}

		const addressId = formData.get("id");
		if (!addressId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"ID de l'adresse requis"
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

		const validation = updateAddressSchema.safeParse(parsedData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				parsedData as Address,
				"Veuillez corriger les erreurs dans le formulaire"
			);
		}

		// Récupérer l'adresse existante avec son client
		const address = await db.address.findUnique({
			where: { id: addressId.toString() },
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

		// Utilisation du destructuring pour extraire seulement les données nécessaires
		// en ignorant le champ id qui est déjà connu
		const { ...addressData } = validation.data;

		// Si cette adresse est définie par défaut, mettre à jour les autres adresses du même type
		if (addressData.isDefault) {
			await db.address.updateMany({
				where: {
					clientId: address.clientId,
					addressType: addressData.addressType,
					isDefault: true,
					id: { not: addressId.toString() },
				},
				data: {
					isDefault: false,
				},
			});
		}

		// Mise à jour de l'adresse
		const updatedAddress = await db.address.update({
			where: { id: addressId.toString() },
			data: addressData,
		});

		const clientName = address.client.name;

		return createSuccessResponse(
			updatedAddress,
			`Adresse mise à jour avec succès pour ${clientName}`
		);
	} catch (error) {
		console.error("[UPDATE_ADDRESS_ERROR]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Une erreur est survenue lors de la mise à jour de l'adresse"
		);
	}
}
