"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { countInvitationsSchema } from "../schemas";
import { fetchCount } from "./fetch-count";

/**
 * Compte le nombre d'invitations d'une organisation selon les critères de filtrage
 * @param params - Paramètres validés par countInvitationsSchema
 * @returns Nombre d'invitations
 */
export async function countInvitations(
	params: z.infer<typeof countInvitationsSchema>
): Promise<number> {
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
