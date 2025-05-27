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
import { Contact } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteContactSchema } from "../schemas/delete-contact-schema";

export const deleteContact: ServerAction<
	Contact,
	typeof deleteContactSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer un contact"
			);
		}

		// 2. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
		};

		// 3. Validation des données
		const validation = deleteContactSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 4. Vérification de l'existence du contact
		const existingContact = await db.contact.findUnique({
			where: { id: validation.data.id },
		});

		if (!existingContact) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Contact introuvable");
		}

		// 5. Vérification qu'on ne supprime pas le dernier contact par défaut
		if (existingContact.isDefault) {
			let otherContactsCount = 0;

			if (existingContact.clientId) {
				otherContactsCount = await db.contact.count({
					where: {
						clientId: existingContact.clientId,
						id: { not: validation.data.id },
					},
				});
			} else if (existingContact.supplierId) {
				otherContactsCount = await db.contact.count({
					where: {
						supplierId: existingContact.supplierId,
						id: { not: validation.data.id },
					},
				});
			}

			if (otherContactsCount === 0) {
				return createErrorResponse(
					ActionStatus.VALIDATION_ERROR,
					"Impossible de supprimer le dernier contact"
				);
			}

			// Si on supprime le contact par défaut et qu'il y a d'autres contacts,
			// on définit le premier autre contact comme par défaut
			if (existingContact.clientId) {
				const firstOtherContact = await db.contact.findFirst({
					where: {
						clientId: existingContact.clientId,
						id: { not: validation.data.id },
					},
					orderBy: { createdAt: "asc" },
				});

				if (firstOtherContact) {
					await db.contact.update({
						where: { id: firstOtherContact.id },
						data: { isDefault: true },
					});
				}
			} else if (existingContact.supplierId) {
				const firstOtherContact = await db.contact.findFirst({
					where: {
						supplierId: existingContact.supplierId,
						id: { not: validation.data.id },
					},
					orderBy: { createdAt: "asc" },
				});

				if (firstOtherContact) {
					await db.contact.update({
						where: { id: firstOtherContact.id },
						data: { isDefault: true },
					});
				}
			}
		}

		// 6. Suppression du contact
		await db.contact.delete({
			where: { id: validation.data.id },
		});

		// 7. Invalidation du cache
		if (existingContact.clientId) {
			revalidateTag(`clients:${existingContact.clientId}:contacts`);
		}
		if (existingContact.supplierId) {
			revalidateTag(`suppliers:${existingContact.supplierId}:contacts`);
		}

		return createSuccessResponse(
			existingContact,
			"Contact supprimé avec succès"
		);
	} catch (error) {
		console.error("[DELETE_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la suppression du contact"
		);
	}
};
