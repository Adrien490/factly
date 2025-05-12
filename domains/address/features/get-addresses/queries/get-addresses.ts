"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
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

		const hasAccess = await hasOrganizationAccess(
			validatedParams.organizationId
		);
		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction avec cache
		return await fetchAddresses(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
