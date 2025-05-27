"use server";

import { auth } from "@/domains/auth";
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

		// 2. Récupération des données
		const rawData = {
			clientId: formData.get("clientId") as string | null,
			supplierId: formData.get("supplierId") as string | null,
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			civility: formData.get("civility") as string,
			function: formData.get("function") as string,
			email: formData.get("email") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			mobileNumber: formData.get("mobileNumber") as string,
			faxNumber: formData.get("faxNumber") as string,
			website: formData.get("website") as string,
			notes: formData.get("notes") as string,
			isDefault: formData.get("isDefault") === "true",
		};

		// 3. Validation des données
		const validation = createContactSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie.",
				rawData
			);
		}

		const validatedParams = validation.data;

		// 4. Vérification qu'un client ou fournisseur est spécifié
		if (!validatedParams.clientId && !validatedParams.supplierId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"Un client ou un fournisseur doit être spécifié"
			);
		}

		// 5. Si isDefault est true, désactiver les autres contacts par défaut
		if (validatedParams.isDefault) {
			if (validatedParams.clientId) {
				await db.contact.updateMany({
					where: {
						clientId: validatedParams.clientId,
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}

			if (validatedParams.supplierId) {
				await db.contact.updateMany({
					where: {
						supplierId: validatedParams.supplierId,
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}
		}

		// 6. Création du contact
		const contact = await db.contact.create({
			data: {
				firstName: validatedParams.firstName,
				lastName: validatedParams.lastName,
				civility: (validatedParams.civility as Civility) || null,
				function: validatedParams.function || null,
				email: validatedParams.email || null,
				phoneNumber: validatedParams.phoneNumber || null,
				mobileNumber: validatedParams.mobileNumber || null,
				faxNumber: validatedParams.faxNumber || null,
				website: validatedParams.website || null,
				notes: validatedParams.notes || null,
				isDefault: validatedParams.isDefault,
				clientId: validatedParams.clientId || null,
				supplierId: validatedParams.supplierId || null,
			},
		});

		// 7. Invalidation du cache
		if (contact.clientId) {
			revalidateTag(`clients:${contact.clientId}:contacts`);
		}
		if (contact.supplierId) {
			revalidateTag(`suppliers:${contact.supplierId}:contacts`);
		}

		return createSuccessResponse(contact, "Le contact a été créé avec succès");
	} catch (error) {
		console.error("[CREATE_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la création du contact"
		);
	}
};
