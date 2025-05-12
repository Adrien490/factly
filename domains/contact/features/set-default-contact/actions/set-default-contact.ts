"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	ServerAction,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
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
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
			clientId: formData.get("clientId") as string | null,
			supplierId: formData.get("supplierId") as string | null,
		};

		console.log("[SET_DEFAULT_CONTACT] Raw Data:", rawData);

		// 2. Validation des données
		const validation = setDefaultContactSchema.safeParse(rawData);

		if (!validation.success) {
			console.log("[SET_DEFAULT_CONTACT] Validation Error:", validation.error);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Données invalides"
			);
		}

		const { id, organizationId, clientId, supplierId } = validation.data;

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Vérification de l'existence du contact
		const existingContact = await db.contact.findFirst({
			where: {
				id,
				OR: [
					{
						client: {
							organizationId,
						},
					},
					{
						supplier: {
							organizationId,
						},
					},
				],
			},
		});

		if (!existingContact) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le contact n'existe pas"
			);
		}

		// 4.1 Vérification si le contact est déjà par défaut
		if (existingContact.isDefault) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"Ce contact est déjà défini comme contact par défaut"
			);
		}

		// 5. Mise à jour des contacts dans une transaction
		await db.$transaction(async (tx) => {
			// 5.1 Réinitialiser le statut par défaut des autres contacts
			if (clientId) {
				await tx.contact.updateMany({
					where: {
						clientId,
						id: {
							not: id,
						},
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
						id: {
							not: id,
						},
					},
					data: {
						isDefault: false,
					},
				});
			}

			// 5.2 Définir le contact comme contact par défaut
			await tx.contact.update({
				where: {
					id,
				},
				data: {
					isDefault: true,
				},
			});
		});

		// 6. Revalidation du cache
		if (clientId) {
			revalidateTag(`org-${organizationId}-client-${clientId}-contacts`);
		}
		if (supplierId) {
			revalidateTag(`org-${organizationId}-supplier-${supplierId}-contacts`);
		}

		return createSuccessResponse(
			existingContact,
			"Le contact par défaut a été mis à jour avec succès"
		);
	} catch (error) {
		console.error("Erreur lors de la définition du contact par défaut:", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la définition du contact par défaut"
		);
	}
};
