"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
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
export async function deleteAddress(
	_: ServerActionState<unknown, typeof deleteAddressSchema>,
	formData: FormData
): Promise<ServerActionState<null, typeof deleteAddressSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
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
				ServerActionStatus.VALIDATION_ERROR,
				"L'identifiant de l'adresse et de l'organisation sont requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawOrganizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
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
			},
		});

		if (!existingAddress) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Adresse introuvable"
			);
		}

		// 6. Vérifier que l'adresse appartient bien à l'organisation spécifiée
		const addressOrganizationId =
			existingAddress.client?.organizationId ||
			existingAddress.supplier?.organizationId;

		if (!addressOrganizationId) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'adresse n'est associée à aucune entité"
			);
		}

		if (addressOrganizationId !== validation.data.organizationId) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"L'adresse n'appartient pas à l'organisation spécifiée"
			);
		}

		// 7. Vérifier si c'est une adresse par défaut et gérer le remplacement
		if (existingAddress.isDefault) {
			let otherAddresses;

			if (existingAddress.clientId) {
				otherAddresses = await db.address.findMany({
					where: {
						clientId: existingAddress.clientId,
						id: { not: validation.data.id },
					},
					take: 1,
				});

				if (otherAddresses.length > 0) {
					// Définir la première autre adresse comme adresse par défaut
					await db.address.update({
						where: { id: otherAddresses[0].id },
						data: { isDefault: true },
					});
				}
			} else if (existingAddress.supplierId) {
				otherAddresses = await db.address.findMany({
					where: {
						supplierId: existingAddress.supplierId,
						id: { not: validation.data.id },
					},
					take: 1,
				});

				if (otherAddresses.length > 0) {
					// Définir la première autre adresse comme adresse par défaut
					await db.address.update({
						where: { id: otherAddresses[0].id },
						data: { isDefault: true },
					});
				}
			}
		}

		// 8. Supprimer l'adresse
		await db.address.delete({
			where: { id: validation.data.id },
		});

		// 9. Revalidation du cache
		// Tags généraux d'adresses
		revalidateTag(`addresses:list`);
		revalidateTag(`addresses:sort:createdAt:desc`); // Tag par défaut pour le tri

		// Tags spécifiques au client ou fournisseur
		if (existingAddress.clientId) {
			revalidateTag(`clients:org:${validation.data.organizationId}`);
			revalidateTag(`client:${existingAddress.clientId}`);
			revalidateTag(
				`client:${existingAddress.clientId}:addresses:user:${session.user.id}`
			);
		}
		if (existingAddress.supplierId) {
			revalidateTag(`suppliers:org:${validation.data.organizationId}`);
			revalidateTag(`supplier:${existingAddress.supplierId}`);
			revalidateTag(
				`supplier:${existingAddress.supplierId}:addresses:user:${session.user.id}`
			);
		}

		return createSuccessResponse(null, "Adresse supprimée avec succès");
	} catch (error) {
		console.error("[DELETE_ADDRESS]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de supprimer l'adresse"
		);
	}
}
