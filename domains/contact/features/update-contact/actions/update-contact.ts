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
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
			clientId: formData.get("clientId") as string,
			supplierId: formData.get("supplierId") as string,
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			civility: formData.get("civility") as string,
			function: formData.get("function") as string,
			email: formData.get("email") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			mobileNumber: formData.get("mobileNumber") as string,
			faxNumber: formData.get("faxNumber") as string,
			website: formData.get("website") as string,
			isDefault: formData.get("isDefault") === "true",
		};

		console.log("[UPDATE_CONTACT] Form Data:", rawData);

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = updateContactSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(
				"[UPDATE_CONTACT] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence du contact
		const existingContact = await db.contact.findFirst({
			where: {
				id: validation.data.id,
				OR: [
					{ clientId: validation.data.clientId },
					{ supplierId: validation.data.supplierId },
				],
			},
		});

		if (!existingContact) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Contact introuvable");
		}

		// 6. Mise à jour dans une transaction pour gérer le contact par défaut
		const updatedContact = await db.$transaction(async (tx) => {
			// Si le contact est marqué comme par défaut, on met à jour les autres contacts
			if (validation.data.isDefault) {
				await tx.contact.updateMany({
					where: {
						OR: [
							{ clientId: validation.data.clientId },
							{ supplierId: validation.data.supplierId },
						],
						isDefault: true,
						id: { not: validation.data.id },
					},
					data: {
						isDefault: false,
					},
				});
			}

			// Mise à jour du contact
			return await tx.contact.update({
				where: { id: validation.data.id },
				data: {
					firstName: validation.data.firstName,
					lastName: validation.data.lastName,
					civility: validation.data.civility as Civility,
					function: validation.data.function,
					email: validation.data.email,
					phoneNumber: validation.data.phoneNumber,
					mobileNumber: validation.data.mobileNumber,
					faxNumber: validation.data.faxNumber,
					website: validation.data.website,
					isDefault: validation.data.isDefault,
				},
			});
		});

		// 7. Revalidation du cache
		if (updatedContact.clientId) {
			revalidateTag(
				`organizations:${rawData.organizationId}:clients:${updatedContact.clientId}:contacts`
			);
		} else if (updatedContact.supplierId) {
			revalidateTag(
				`organizations:${rawData.organizationId}:suppliers:${updatedContact.supplierId}:contacts`
			);
		}

		return createSuccessResponse(
			updatedContact,
			`Contact "${updatedContact.firstName} ${updatedContact.lastName}" mis à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de mettre à jour le contact"
		);
	}
};
