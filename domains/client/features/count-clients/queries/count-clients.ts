"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization";
import { headers } from "next/headers";
import { z } from "zod";
import { fetchCount } from ".";
import { countClientsSchema } from "../schemas";
import { CountClientsReturn } from "../types";

/**
 * Compte le nombre de clients d'une organisation selon les critères de recherche et de filtrage
 * @param params - Paramètres validés par countClientsSchema
 * @returns Nombre de clients
 */
export async function countClients(
	params: z.infer<typeof countClientsSchema>
): Promise<CountClientsReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(params.organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction
		return await fetchCount(params);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
