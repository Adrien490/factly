"use server";

import { auth } from "@/domains/auth";
import { checkMembership } from "@/domains/member/features/check-membership";
import { headers } from "next/headers";
import { z } from "zod";
import { fetchCount } from ".";
import { countClientsSchema } from "../schemas";

/**
 * Compte le nombre de clients d'une organisation selon les critères de recherche et de filtrage
 * @param params - Paramètres validés par countClientsSchema
 * @returns Nombre de clients
 */
export async function countClients(
	params: z.infer<typeof countClientsSchema>
): Promise<number> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return 0;
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
