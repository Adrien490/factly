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
import {
	AddressType,
	Client,
	ClientStatus,
	ClientType,
	Country,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createClientSchema } from "../schemas";

/**
 * Action serveur pour créer un nouveau client
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La référence du client doit être unique dans l'organisation
 */
export async function createClient(
	_: ActionState<Client, typeof createClientSchema> | null,
	formData: FormData
): Promise<ActionState<Client, typeof createClientSchema>> {
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

			// Informations d'adresse (à traiter séparément)
			addressType: formData.get("addressType") as AddressType,
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: (formData.get("country") as Country) || Country.FRANCE,

			// Coordonnées géographiques
			latitude: formData.get("latitude")
				? parseFloat(formData.get("latitude") as string)
				: null,
			longitude: formData.get("longitude")
				? parseFloat(formData.get("longitude") as string)
				: null,
		};

		console.log("[CREATE_CLIENT] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = createClientSchema.safeParse(rawData);
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
			},
			select: { id: true },
		});

		if (existingClient) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Un client avec cette référence existe déjà dans l'organisation"
			);
		}

		// 7. Création du client dans la base de données
		const {
			organizationId: validatedOrgId,

			// Extraire les champs d'adresse pour les gérer séparément
			addressType,
			addressLine1,
			addressLine2,
			postalCode,
			city,
			country,
			userId,
			latitude,
			longitude,
			...clientData
		} = validation.data;

		// Créer le client avec les relations appropriées
		const client = await db.client.create({
			data: {
				...clientData,
				user: { connect: { id: userId } },
				organization: { connect: { id: validatedOrgId } },

				// Créer l'adresse de facturation si des informations sont fournies
				...(addressLine1 &&
					addressLine1.trim() !== "" && {
						addresses: {
							create: [
								{
									addressType,
									addressLine1,
									addressLine2,
									postalCode: postalCode || "",
									city: city || "",
									country: country as Country,
									isDefault: true,
									...(latitude !== null &&
										longitude !== null && {
											latitude,
											longitude,
										}),
								},
							],
						},
					}),

				// Gestion des relations si des données sont fournies
			},
		});

		// 8. Invalidation du cache pour forcer un rafraîchissement des données
		// Invalider le tag de base pour tous les clients de l'organisation
		revalidateTag(`organization:${validatedOrgId}:clients`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			client,
			`Le client ${client.name} a été créé avec succès`
		);
	} catch (error) {
		console.error("[CREATE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le client"
		);
	}
}
