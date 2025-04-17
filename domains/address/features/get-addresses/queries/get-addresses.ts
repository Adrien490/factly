"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { getAddressesSchema } from "../schemas";
import { GetAddressesReturn } from "../types";
import { fetchAddresses } from "./fetch-addresses";

/**
 * Récupère les adresses associées à un client ou un fournisseur
 * @param params - Paramètres validés par getAddressesSchema
 * @returns Liste des adresses (sans pagination)
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

		// Vérification du droit d'accès
		// Pour déterminer l'organization, nous devons vérifier si c'est un client ou fournisseur
		let organizationId: string;

		// Pour un client
		if (validatedParams.clientId) {
			const client = await db.client.findUnique({
				where: { id: validatedParams.clientId },
				select: { organizationId: true },
			});

			if (!client) {
				throw new Error("Client not found");
			}

			organizationId = client.organizationId;
		}
		// Pour un fournisseur
		else if (validatedParams.supplierId) {
			const supplier = await db.supplier.findUnique({
				where: { id: validatedParams.supplierId },
				select: { organizationId: true },
			});

			if (!supplier) {
				throw new Error("Supplier not found");
			}

			organizationId = supplier.organizationId;
		} else {
			throw new Error("Either clientId or supplierId must be provided");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction avec cache
		return await fetchAddresses(validatedParams, session.user.id);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
