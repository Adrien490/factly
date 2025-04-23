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

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawOrganizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
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
				{ id: rawId, organizationId: rawOrganizationId },
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
				client: { select: { organizationId: true } },
				supplier: { select: { organizationId: true } },
				addressType: true,
			},
		});

		if (!existingAddress) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Adresse introuvable");
		}

		// 6. Vérifier que l'adresse appartient bien à l'organisation spécifiée
		const addressOrganizationId =
			existingAddress.client?.organizationId ||
			existingAddress.supplier?.organizationId;

		if (!addressOrganizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'adresse n'est associée à aucune entité"
			);
		}

		if (addressOrganizationId !== validation.data.organizationId) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"L'adresse n'appartient pas à l'organisation spécifiée"
			);
		}

		// 8. Supprimer l'adresse
		await db.address.delete({
			where: { id: validation.data.id },
		});

		// 9. Revalidation du cache
		// Tags généraux d'adresses
		revalidateTag(`organization:${validation.data.organizationId}:addresses`);
		revalidateTag(
			`organization:${validation.data.organizationId}:addresses:sort:createdAt:desc`
		); // Tag par défaut pour le tri

		// Tags spécifiques au client ou fournisseur
		if (existingAddress.clientId) {
			revalidateTag(`organization:${validation.data.organizationId}:clients`);
			revalidateTag(
				`organization:${validation.data.organizationId}:client:${existingAddress.clientId}`
			);
			revalidateTag(
				`organization:${validation.data.organizationId}:client:${existingAddress.clientId}:addresses`
			);
		}
		if (existingAddress.supplierId) {
			revalidateTag(`organization:${validation.data.organizationId}:suppliers`);
			revalidateTag(
				`organization:${validation.data.organizationId}:supplier:${existingAddress.supplierId}`
			);
			revalidateTag(
				`organization:${validation.data.organizationId}:supplier:${existingAddress.supplierId}:addresses`
			);
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
