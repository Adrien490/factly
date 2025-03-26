"use server";

import { auth } from "@/features/auth/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { hasOrganizationAccess } from "../../has-access";
import { getOrganizationsSchema } from "../schemas";
import { GetOrganizationsReturn } from "../types";
import { fetchOrganizations } from "./fetch-organizations";

/**
 * Récupère la liste des organisations d'un utilisateur avec filtrage et recherche
 * @param params - Paramètres validés par getOrganizationsSchema
 * @returns Liste des organisations et nombre total
 */
export async function getOrganizations(
	params: z.infer<typeof getOrganizationsSchema>
): Promise<GetOrganizationsReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		if (!hasOrganizationAccess(session.user.id)) {
			throw new Error("Unauthorized");
		}

		const validation = getOrganizationsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Appel à la fonction de récupération
		return await fetchOrganizations(validatedParams, session.user.id);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
