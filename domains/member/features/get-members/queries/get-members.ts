"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getMembersSchema } from "../schemas";
import { GetMembersReturn } from "../types";
import { fetchMembers } from "./fetch-members";

/**
 * Récupère la liste des membres avec pagination, filtrage et recherche
 * @param params - Paramètres validés par getMembersSchema
 * @returns Liste des membres et informations de pagination
 */
export async function getMembers(
	params: z.infer<typeof getMembersSchema>
): Promise<GetMembersReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validation = getMembersSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		return await fetchMembers(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
