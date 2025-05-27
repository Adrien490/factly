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
import { setDefaultContactSchema } from "../schemas/set-default-contact-schema";

export const setDefaultContact: ServerAction<
	Contact,
	typeof setDefaultContactSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour définir un contact par défaut"
			);
		}

		// 2. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
			clientId: formData.get("clientId") as string,
			supplierId: formData.get("supplierId") as string,
		};

		// 3. Validation des données
		const validation = setDefaultContactSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		const { id, clientId, supplierId } = validation.data;

		// 4. Vérification de l'existence du contact
		const existingContact = await db.contact.findFirst({
			where: {
				id,
				OR: [{ clientId }, { supplierId }],
			},
		});

		if (!existingContact) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Contact introuvable");
		}

		// 5. Si le contact est déjà par défaut, pas besoin de continuer
		if (existingContact.isDefault) {
			return createSuccessResponse(
				existingContact,
				"Ce contact est déjà défini par défaut"
			);
		}

		// 6. Mise à jour dans une transaction
		const updatedContact = await db.$transaction(async (tx) => {
			// Désactiver tous les autres contacts par défaut
			if (clientId) {
				await tx.contact.updateMany({
					where: {
						clientId,
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}

			if (supplierId) {
				await tx.contact.updateMany({
					where: {
						supplierId,
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});
			}

			// Définir le nouveau contact par défaut
			return await tx.contact.update({
				where: { id },
				data: { isDefault: true },
			});
		});

		// 7. Invalidation du cache
		if (clientId) {
			revalidateTag(`clients`);
			revalidateTag(`clients:${clientId}:contacts`);
		}
		if (supplierId) {
			revalidateTag(`suppliers`);
			revalidateTag(`suppliers:${supplierId}:contacts`);
		}

		return createSuccessResponse(
			updatedContact,
			"Contact défini par défaut avec succès"
		);
	} catch (error) {
		console.error("[SET_DEFAULT_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la définition du contact par défaut"
		);
	}
};
