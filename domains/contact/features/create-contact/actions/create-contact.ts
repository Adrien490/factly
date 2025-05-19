"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Civility, Contact } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createContactSchema } from "../schemas/create-contact-schema";

/**
 * Action serveur pour créer un nouveau contact
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Un clientId ou supplierId doit être fourni
 */
export const createContact: ServerAction<
	Contact,
	typeof createContactSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un contact"
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
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			civility: formData.get("civility") as Civility,
			function: formData.get("function") as string,
			isDefault: formData.get("isDefault") === "true",

			// Coordonnées
			email: formData.get("email") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			mobileNumber: formData.get("mobileNumber") as string,
			faxNumber: formData.get("faxNumber") as string,
			website: formData.get("website") as string,
			notes: formData.get("notes") as string,

			// Relations
			clientId: formData.get("clientId") as string,
			supplierId: formData.get("supplierId") as string,
		};

		console.log("[CREATE_CONTACT] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = createContactSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_CONTACT] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires",
				rawData
			);
		}

		const validatedParams = validation.data;

		// 6. Vérification qu'un clientId ou supplierId est fourni
		if (!validatedParams.clientId && !validatedParams.supplierId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"Un client ou un fournisseur doit être spécifié"
			);
		}

		// 7. Création du contact dans une transaction pour garantir l'atomicité
		const contact = await db.$transaction(async (tx) => {
			// Si le contact est marqué comme par défaut, on met à jour les autres contacts
			if (validatedParams.isDefault) {
				await tx.contact.updateMany({
					where: {
						OR: [
							{
								clientId: validatedParams.clientId,
							},
							{
								supplierId: validatedParams.supplierId,
							},
						],
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}

			// Création du nouveau contact
			return await tx.contact.create({
				data: {
					firstName: validatedParams.firstName || "",
					lastName: validatedParams.lastName,
					civility: validatedParams.civility as Civility | null,
					function: validatedParams.function,
					email: validatedParams.email,
					phoneNumber: validatedParams.phoneNumber,
					mobileNumber: validatedParams.mobileNumber,
					faxNumber: validatedParams.faxNumber,
					website: validatedParams.website,
					notes: validatedParams.notes,
					isDefault: validatedParams.isDefault,
					clientId: validatedParams.clientId,
					supplierId: validatedParams.supplierId,
				},
			});
		});

		// 8. Invalidation du cache pour forcer un rafraîchissement des données
		if (contact.clientId) {
			revalidateTag(
				`organizations:${validatedParams.organizationId}:clients:${contact.clientId}:contacts`
			);
		} else if (contact.supplierId) {
			revalidateTag(
				`organizations:${validatedParams.organizationId}:suppliers:${contact.supplierId}:contacts`
			);
		}

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			contact,
			`Le contact ${contact.firstName} ${contact.lastName} a été créé avec succès`
		);
	} catch (error) {
		console.error("[CREATE_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le contact"
		);
	}
};
