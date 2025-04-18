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
} from "@/shared/types/server-action";
import { Address, AddressType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createAddressSchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle adresse
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export async function createAddress(
	_: ActionState<Address, typeof createAddressSchema>,
	formData: FormData
): Promise<ActionState<Address, typeof createAddressSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une adresse"
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

			// Relations optionnelles
			clientId: (formData.get("clientId") as string) || null,
			supplierId: (formData.get("supplierId") as string) || null,
		};

		// 5. Validation des données avec le schéma Zod
		const validation = createAddressSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_ADDRESS] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Création de l'adresse dans la base de données
		const {
			organizationId: validatedOrgId,
			clientId,
			supplierId,
			...addressData
		} = validation.data;

		// Vérifier si c'est l'adresse par défaut et associée à une entité
		if (addressData.isDefault) {
			// Si c'est pour un client, réinitialiser les autres adresses par défaut du même type
			if (clientId) {
				await db.address.updateMany({
					where: {
						clientId,
						addressType: addressData.addressType, // Filtrer par type d'adresse
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}

			// Si c'est pour un fournisseur, réinitialiser les autres adresses par défaut du même type
			if (supplierId) {
				await db.address.updateMany({
					where: {
						supplierId,
						addressType: addressData.addressType, // Filtrer par type d'adresse
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}
		}

		// Créer l'adresse avec les relations appropriées
		const address = await db.address.create({
			data: {
				...addressData,
				...(clientId && { client: { connect: { id: clientId } } }),
				...(supplierId && { supplier: { connect: { id: supplierId } } }),
			},
		});

		// 7. Invalidation du cache pour forcer un rafraîchissement des données
		// Tags généraux d'adresses
		revalidateTag(`addresses:list`);
		revalidateTag(`addresses:sort:createdAt:desc`); // Tag par défaut pour le tri

		// Tags spécifiques au client ou fournisseur
		if (clientId) {
			revalidateTag(`clients:${validatedOrgId}:user:${session.user.id}`);
			revalidateTag(`client:${clientId}`);
			revalidateTag(`client:${clientId}:addresses:user:${session.user.id}`);
		}
		if (supplierId) {
			revalidateTag(`suppliers:${validatedOrgId}:user:${session.user.id}`);
			revalidateTag(`supplier:${supplierId}`);
			revalidateTag(`supplier:${supplierId}:addresses:user:${session.user.id}`);
		}

		// 8. Retour de la réponse de succès
		return createSuccessResponse(address, `L'adresse a été créée avec succès`);
	} catch (error) {
		console.error("[CREATE_ADDRESS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer l'adresse"
		);
	}
}
