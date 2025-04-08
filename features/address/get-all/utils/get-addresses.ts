"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { getAddressesSchema } from "../schemas";
import { GetAddressesReturn } from "../types";
import { fetchAddresses } from "./fetch-addresses";

/**
 * Récupère la liste des adresses pour un client ou fournisseur
 */
export async function getAddresses(
	params: z.infer<typeof getAddressesSchema>
): Promise<GetAddressesReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = getAddressesSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Si nous avons un clientId, nous devons vérifier l'accès à l'organisation du client
		if (validatedParams.clientId) {
			// Dans un cas réel, il faudrait récupérer l'organizationId du client
			// pour vérifier les droits d'accès
			const client = await getClientOrganization(validatedParams.clientId);

			if (!client) {
				throw new Error("Client not found");
			}

			const hasAccess = await hasOrganizationAccess(client.organizationId);

			if (!hasAccess) {
				throw new Error("Access denied");
			}
		}

		// Si nous avons un supplierId, nous devons vérifier l'accès à l'organisation du fournisseur
		if (validatedParams.supplierId) {
			// Dans un cas réel, il faudrait récupérer l'organizationId du fournisseur
			// pour vérifier les droits d'accès
			const supplier = await getSupplierOrganization(
				validatedParams.supplierId
			);

			if (!supplier) {
				throw new Error("Supplier not found");
			}

			const hasAccess = await hasOrganizationAccess(supplier.organizationId);

			if (!hasAccess) {
				throw new Error("Access denied");
			}
		}

		// Appel à la fonction
		return await fetchAddresses(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}

// Fonction utilitaire pour récupérer l'organisation d'un client
async function getClientOrganization(clientId: string) {
	const client = await db.client.findUnique({
		where: { id: clientId },
		select: { organizationId: true },
	});

	return client;
}

// Fonction utilitaire pour récupérer l'organisation d'un fournisseur
async function getSupplierOrganization(supplierId: string) {
	const supplier = await db.supplier.findUnique({
		where: { id: supplierId },
		select: { organizationId: true },
	});

	return supplier;
}
