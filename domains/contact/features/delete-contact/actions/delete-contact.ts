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
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
			clientId: formData.get("clientId") as string,
			supplierId: formData.get("supplierId") as string,
		};

		console.log("[DELETE_CONTACT] Form Data:", rawData);

		// Vérification que l'organizationId n'est pas vide
		if (!rawData.organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteContactSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(
				"[DELETE_CONTACT] Validation errors:",
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

		// 6. Suppression
		await db.contact.delete({
			where: { id: validation.data.id },
		});

		// 7. Revalidation du cache
		if (existingContact.clientId) {
			revalidateTag(
				`organizations:${rawData.organizationId}:clients:${existingContact.clientId}:contacts`
			);
		} else if (existingContact.supplierId) {
			revalidateTag(
				`organizations:${rawData.organizationId}:suppliers:${existingContact.supplierId}:contacts`
			);
		}

		return createSuccessResponse(
			existingContact,
			`Contact "${existingContact.firstName} ${existingContact.lastName}" supprimé définitivement`
		);
	} catch (error) {
		console.error("[DELETE_CONTACT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer définitivement le contact"
		);
	}
};
