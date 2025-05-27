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
import { updateContactSchema } from "../schemas/update-contact-schema";

export const updateContact: ServerAction<
	Contact,
	typeof updateContactSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un contact"
			);
		}

		// 2. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
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
		const validation = updateContactSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie.",
				rawData
			);
		}

		// 4. Vérification de l'existence du contact
		const existingContact = await db.contact.findUnique({
			where: { id: rawData.id },
			select: {
				id: true,
				clientId: true,
				supplierId: true,
				isDefault: true,
			},
		});

		if (!existingContact) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Contact introuvable");
		}

		// 5. Si isDefault est true, désactiver les autres contacts par défaut
		if (validation.data.isDefault && !existingContact.isDefault) {
			if (existingContact.clientId) {
				await db.contact.updateMany({
					where: {
						clientId: existingContact.clientId,
						isDefault: true,
						id: { not: rawData.id },
					},
					data: { isDefault: false },
				});
			}

			if (existingContact.supplierId) {
				await db.contact.updateMany({
					where: {
						supplierId: existingContact.supplierId,
						isDefault: true,
						id: { not: rawData.id },
					},
					data: { isDefault: false },
				});
			}
		}

		// 6. Mise à jour du contact
		const updatedContact = await db.contact.update({
			where: { id: rawData.id },
			data: {
				firstName: validation.data.firstName,
				lastName: validation.data.lastName,
				civility: (validation.data.civility as Civility) || null,
				function: validation.data.function || null,
				email: validation.data.email || null,
				phoneNumber: validation.data.phoneNumber || null,
				mobileNumber: validation.data.mobileNumber || null,
				faxNumber: validation.data.faxNumber || null,
				website: validation.data.website || null,
				notes: validation.data.notes || null,
				isDefault: validation.data.isDefault,
			},
		});

		// 7. Invalidation du cache
		if (updatedContact.clientId) {
			revalidateTag(`clients:${updatedContact.clientId}:contacts`);
		}
		if (updatedContact.supplierId) {
			revalidateTag(`suppliers:${updatedContact.supplierId}:contacts`);
		}

		return createSuccessResponse(
			updatedContact,
			"Le contact a été mis à jour avec succès"
		);
	} catch (error) {
		console.error("[UPDATE_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du contact"
		);
	}
};
