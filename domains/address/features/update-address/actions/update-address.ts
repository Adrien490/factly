"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Address, AddressType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateAddressSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour une adresse
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export async function updateAddress(
	_: ServerActionState<Address, typeof updateAddressSchema>,
	formData: FormData
): Promise<ServerActionState<Address, typeof updateAddressSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier une adresse"
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

		// 4. Vérification de l'ID de l'adresse
		const addressId = formData.get("id");
		if (!addressId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'adresse est requis"
			);
		}

		// 5. Vérification de l'existence de l'adresse
		const existingAddress = await db.address.findUnique({
			where: { id: addressId.toString() },
		});

		if (!existingAddress) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"L'adresse n'existe pas"
			);
		}

		// 6. Préparation et transformation des données brutes
		const rawData = {
			id: addressId.toString(),
			organizationId: organizationId.toString(),
			addressType:
				(formData.get("addressType") as AddressType) || AddressType.BILLING,
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: (formData.get("country") as string) || "France",
			isDefault:
				formData.get("isDefault") === "on" ||
				formData.get("isDefault") === "true",

			// Coordonnées géographiques
			latitude: formData.get("latitude")
				? parseFloat(formData.get("latitude") as string)
				: null,
			longitude: formData.get("longitude")
				? parseFloat(formData.get("longitude") as string)
				: null,

			// Relations - conservons les relations existantes
			clientId: existingAddress.clientId,
			supplierId: existingAddress.supplierId,
		};

		// 7. Validation des données avec le schéma Zod
		const validation = updateAddressSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_ADDRESS] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 8. Mise à jour de l'adresse dans la base de données
		const {
			id,
			organizationId: validatedOrgId,
			...addressData
		} = validation.data;

		// Vérifier si c'est l'adresse par défaut
		if (addressData.isDefault) {
			// Si c'est pour un client, réinitialiser les autres adresses par défaut du même type
			if (existingAddress.clientId) {
				await db.address.updateMany({
					where: {
						clientId: existingAddress.clientId,
						addressType: addressData.addressType, // Filtrer par type d'adresse
						isDefault: true,
						id: { not: id }, // Ne pas modifier l'adresse en cours de mise à jour
					},
					data: {
						isDefault: false,
					},
				});
			}

			// Si c'est pour un fournisseur, réinitialiser les autres adresses par défaut du même type
			if (existingAddress.supplierId) {
				await db.address.updateMany({
					where: {
						supplierId: existingAddress.supplierId,
						addressType: addressData.addressType, // Filtrer par type d'adresse
						isDefault: true,
						id: { not: id }, // Ne pas modifier l'adresse en cours de mise à jour
					},
					data: {
						isDefault: false,
					},
				});
			}
		}

		// Mettre à jour l'adresse
		const updatedAddress = await db.address.update({
			where: { id },
			data: addressData,
		});

		// 9. Invalidation du cache pour forcer un rafraîchissement des données
		// Tags généraux d'adresses
		revalidateTag(`addresses:list`);
		revalidateTag(`addresses:sort:createdAt:desc`); // Tag par défaut pour le tri

		// Tags spécifiques au client ou fournisseur
		if (existingAddress.clientId) {
			revalidateTag(`clients:${validatedOrgId}:user:${session.user.id}`);
			revalidateTag(`client:${existingAddress.clientId}`);
			revalidateTag(
				`client:${existingAddress.clientId}:addresses:user:${session.user.id}`
			);
		}
		if (existingAddress.supplierId) {
			revalidateTag(`suppliers:${validatedOrgId}:user:${session.user.id}`);
			revalidateTag(`supplier:${existingAddress.supplierId}`);
			revalidateTag(
				`supplier:${existingAddress.supplierId}:addresses:user:${session.user.id}`
			);
		}

		// 10. Retour de la réponse de succès
		return createSuccessResponse(
			updatedAddress,
			`L'adresse a été mise à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_ADDRESS]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de mettre à jour l'adresse"
		);
	}
}
