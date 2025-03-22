"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import {
	Client,
	ClientPriority,
	ClientStatus,
	ClientType,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import clientFormSchema from "../schemas/create-client-schema";

/**
 * Action serveur pour créer un nouveau client
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La référence du client doit être unique dans l'organisation
 */
export default async function createClient(
	_: ServerActionState<Client, typeof clientFormSchema>,
	formData: FormData
): Promise<ServerActionState<Client, typeof clientFormSchema>> {
	try {
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
			priority: formData.get("priority") as ClientPriority,
			notes: formData.get("notes") as string,
			userId: session.user.id,
			vatNumber: formData.get("vatNumber") as string,

			// Informations d'adresse (à traiter séparément)
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: (formData.get("country") as string) || "France",

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
		const validation = clientFormSchema.safeParse(rawData);
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
				ServerActionStatus.CONFLICT,
				"Un client avec cette référence existe déjà dans l'organisation"
			);
		}

		// 7. Création du client dans la base de données
		const {
			organizationId: validatedOrgId,
			tags,
			// Extraire les champs d'adresse pour les gérer séparément
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
							create: {
								addressType: "BILLING",
								line1: addressLine1,
								line2: addressLine2,
								postalCode: postalCode || "",
								city: city || "",
								region: null,
								country: country || "France",
								isDefault: true,
								// Ajouter les coordonnées géographiques si disponibles
								...(latitude !== null &&
									longitude !== null && {
										latitude,
										longitude,
									}),
							},
						},
					}),

				// Gestion des relations si des données sont fournies

				...(tags &&
					tags.length > 0 && {
						tags: {
							connect: tags.map((id) => ({ id })),
						},
					}),
			},
		});

		// 8. Revalidation du cache
		revalidateTag(`client:${client.id}`);
		revalidateTag(`client:org:${validatedOrgId}:${client.id}`);
		revalidateTag(`clients:org:${validatedOrgId}`);
		revalidateTag("clients:list");

		// 9. Retour de la réponse de succès
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
}
