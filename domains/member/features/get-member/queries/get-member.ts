"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getMemberSchema } from "../schemas/get-member-schema";
import { GetMemberReturn } from "../types";
import { fetchMember } from "./fetch-member";

/**
 * Récupère les détails d'un membre spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getMember(
	params: z.infer<typeof getMemberSchema>
): Promise<GetMemberReturn> {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	// Validation des paramètres
	const validation = getMemberSchema.safeParse(params);
	if (!validation.success) {
		throw new Error("Invalid parameters");
	}

	const validatedParams = validation.data;

	// Appel à la fonction cacheable
	return fetchMember(validatedParams);
}
