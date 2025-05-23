"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getClientsSchema } from "../schemas";
import { GetClientsReturn } from "../types";
import { fetchClients } from "./fetch-clients";

/**
 * Récupère la liste des clients d'une organisation avec pagination, filtrage et recherche
 * @param params - Paramètres validés par getClientsSchema
 * @returns Liste des clients et informations de pagination
 */
export async function getClients(
	params: z.infer<typeof getClientsSchema>
): Promise<GetClientsReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(
			params.organizationId as string
		);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		const validation = getClientsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		return await fetchClients(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
