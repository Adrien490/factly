"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { deleteMultipleAddressesSchema } from "../schemas";
import { DeleteMultipleAddressesReturn } from "../types";

/**
 * Supprime plusieurs adresses existantes
 */
export async function deleteMultipleAddresses(
	params: z.infer<typeof deleteMultipleAddressesSchema>
): Promise<DeleteMultipleAddressesReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = deleteMultipleAddressesSchema.safeParse(params);

		if (!validation.success) {
			return {
				success: false,
				count: 0,
				message: "Paramètres invalides",
			};
		}

		const validatedParams = validation.data;

		// Récupérer toutes les adresses à supprimer pour vérifier l'accès
		const addresses = await db.address.findMany({
			where: { id: { in: validatedParams.ids } },
			select: {
				id: true,
				isDefault: true,
				clientId: true,
				supplierId: true,
				client: { select: { organizationId: true } },
				supplier: { select: { organizationId: true } },
			},
		});

		if (addresses.length === 0) {
			return {
				success: false,
				count: 0,
				message: "Aucune adresse trouvée",
			};
		}

		// Vérifier les droits d'accès à l'organisation pour chaque adresse
		for (const address of addresses) {
			const organizationId =
				address.client?.organizationId || address.supplier?.organizationId;

			if (!organizationId) {
				continue; // Ignorer cette adresse
			}

			const hasAccess = await hasOrganizationAccess(organizationId);

			if (!hasAccess) {
				return {
					success: false,
					count: 0,
					message: "Accès refusé à une ou plusieurs adresses",
				};
			}
		}

		// Traiter les adresses par défaut
		// Nous allons regrouper les adresses par client/fournisseur
		// pour gérer les adresses par défaut
		const clientsWithDefaultAddresses = new Set<string>();
		const suppliersWithDefaultAddresses = new Set<string>();

		// Identifier les clients/fournisseurs qui vont perdre leur adresse par défaut
		addresses.forEach((address) => {
			if (address.isDefault) {
				if (address.clientId) {
					clientsWithDefaultAddresses.add(address.clientId);
				} else if (address.supplierId) {
					suppliersWithDefaultAddresses.add(address.supplierId);
				}
			}
		});

		// Pour chaque client qui perd son adresse par défaut, définir une autre adresse par défaut
		for (const clientId of clientsWithDefaultAddresses) {
			const otherAddresses = await db.address.findMany({
				where: {
					clientId,
					id: { notIn: validatedParams.ids },
				},
				take: 1,
			});

			if (otherAddresses.length > 0) {
				await db.address.update({
					where: { id: otherAddresses[0].id },
					data: { isDefault: true },
				});
			}
		}

		// Pour chaque fournisseur qui perd son adresse par défaut, définir une autre adresse par défaut
		for (const supplierId of suppliersWithDefaultAddresses) {
			const otherAddresses = await db.address.findMany({
				where: {
					supplierId,
					id: { notIn: validatedParams.ids },
				},
				take: 1,
			});

			if (otherAddresses.length > 0) {
				await db.address.update({
					where: { id: otherAddresses[0].id },
					data: { isDefault: true },
				});
			}
		}

		// Supprimer les adresses
		const result = await db.address.deleteMany({
			where: { id: { in: validatedParams.ids } },
		});

		return {
			success: true,
			count: result.count,
			message: `${result.count} adresse(s) supprimée(s) avec succès`,
		};
	} catch (error) {
		return {
			success: false,
			count: 0,
			message:
				error instanceof Error ? error.message : "Une erreur est survenue",
		};
	}
}
