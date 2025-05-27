"use server";

import { auth } from "@/domains/auth";
import { checkMembership } from "@/domains/member/features/check-membership";
import { headers } from "next/headers";
import { z } from "zod";
import { getClientsSchema } from "../schemas";
import { GetClientsReturn } from "../types";
import { fetchClients } from "./fetch-clients";

/**
 * Récupère la liste des clients avec pagination, filtrage et recherche
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

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return {
				clients: [],
				pagination: {
					total: 0,
					page: 1,
					perPage: 10,
					pageCount: 0,
				},
			};
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
