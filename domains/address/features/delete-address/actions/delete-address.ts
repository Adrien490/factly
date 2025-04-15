"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { deleteAddressSchema } from "../schemas";
import { DeleteAddressReturn } from "../types";

/**
 * Supprime une adresse existante
 */
export async function deleteAddress(
	params: z.infer<typeof deleteAddressSchema>
): Promise<DeleteAddressReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = deleteAddressSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Récupérer l'adresse existante pour vérifier l'accès
		const existingAddress = await db.address.findUnique({
			where: { id: validatedParams.id },
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
			return { success: false, message: "Address not found" };
		}

		// Vérifier les droits d'accès à l'organisation
		const organizationId =
			existingAddress.client?.organizationId ||
			existingAddress.supplier?.organizationId;

		if (!organizationId) {
			throw new Error("Address is not associated with any organization");
		}

		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Vérifier si c'est une adresse par défaut
		if (existingAddress.isDefault) {
			// Si c'est l'adresse par défaut, il faut en définir une autre comme adresse par défaut
			// ou retourner une erreur si c'est la seule adresse
			let otherAddresses;

			if (existingAddress.clientId) {
				otherAddresses = await db.address.findMany({
					where: {
						clientId: existingAddress.clientId,
						id: { not: existingAddress.id },
					},
					take: 1, // On a juste besoin de savoir s'il y en a d'autres
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
						id: { not: existingAddress.id },
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

		// Supprimer l'adresse
		await db.address.delete({
			where: { id: validatedParams.id },
		});

		return {
			success: true,
			message: "Adresse supprimée avec succès",
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				message: "Paramètres invalides",
			};
		}

		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Une erreur est survenue",
		};
	}
}
