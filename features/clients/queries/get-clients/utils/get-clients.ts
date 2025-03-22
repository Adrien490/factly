"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import { headers } from "next/headers";
import { z } from "zod";
import getClientsSchema from "../../../schemas/get-clients-schema";
import { GetClientsReturn } from "../types";
import { fetchClients } from "./fetch-clients";

/**
 * Récupère la liste des clients d'une organisation avec pagination, filtrage et recherche
 * @param params - Paramètres validés par getClientsSchema
 * @returns Liste des clients et informations de pagination
 */
export default async function getClients(
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
		const hasAccess = await hasOrganizationAccess(params.organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction
		return await fetchClients(params, session.user.id);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
