"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getInvitationsSchema } from "../schemas";
import { GetInvitationsReturn } from "../types";
import { fetchInvitations } from "./fetch-invitations";

/**
 * Récupère la liste des invitations d'une organisation
 * @param params - Paramètres validés par getInvitationsSchema
 * @returns Liste des invitations
 */
export async function getInvitations(
	params: z.infer<typeof getInvitationsSchema>
): Promise<GetInvitationsReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validation = getInvitationsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Vérification de l'accès à l'organisation

		// Appel à la fonction de récupération
		return await fetchInvitations(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
