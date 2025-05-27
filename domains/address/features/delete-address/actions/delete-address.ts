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
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteAddressSchema } from "../schemas";

/**
 * Action serveur pour supprimer une adresse
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - L'adresse doit exister et appartenir à l'organisation
 */
export const deleteAddress: ServerAction<
	null,
	typeof deleteAddressSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour supprimer une adresse"
			);
		}

		// 2. Vérification de base des données requises
		const rawId = formData.get("id");
		const rawOrganizationId = formData.get("organizationId");
		if (
			!rawId ||
			typeof rawId !== "string" ||
			!rawOrganizationId ||
			typeof rawOrganizationId !== "string"
		) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'identifiant de l'adresse et de l'organisation sont requis"
			);
		}

		// 4. Validation complète des données
		const validation = deleteAddressSchema.safeParse({
			id: rawId,
			organizationId: rawOrganizationId,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Types invalides"
			);
		}

		// 5. Récupérer l'adresse existante
		const existingAddress = await db.address.findUnique({
			where: { id: validation.data.id },
			select: {
				id: true,
				isDefault: true,
				clientId: true,
				supplierId: true,
				addressType: true,
			},
		});

		if (!existingAddress) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Adresse introuvable");
		}

		// 6. Vérifier que l'adresse appartient bien à l'organisation spécifiée

		if (!existingAddress.clientId && !existingAddress.supplierId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'adresse n'est associée à aucune entité"
			);
		}

		// 8. Supprimer l'adresse
		await db.address.delete({
			where: { id: validation.data.id },
		});

		// 9. Revalidation du cache
		// Tags généraux d'adresses
		revalidateTag(`addresses`);

		// Tags spécifiques au client ou fournisseur
		if (existingAddress.clientId) {
			revalidateTag(`clients:${existingAddress.clientId}`);
		}
		if (existingAddress.supplierId) {
			revalidateTag(`suppliers:${existingAddress.supplierId}`);
		}

		return createSuccessResponse(null, "Adresse supprimée avec succès");
	} catch (error) {
		console.error("[DELETE_ADDRESS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer l'adresse"
		);
	}
};
