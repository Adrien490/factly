"use server";

import { auth } from "@/domains/auth";
import { checkMembership } from "@/domains/member/features/check-membership";
import { headers } from "next/headers";
import { z } from "zod";
import { getClientSchema } from "../schemas/get-client-schema";
import { GetClientReturn } from "../types";
import { fetchClient } from "./fetch-client";

/**
 * Récupère les détails d'un client spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getClient(
	params: z.infer<typeof getClientSchema>
): Promise<GetClientReturn> {
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
		return null;
	}

	// Validation des paramètres
	const validation = getClientSchema.safeParse(params);
	if (!validation.success) {
		throw new Error("Invalid parameters");
	}

	const validatedParams = validation.data;

	// Appel à la fonction cacheable
	return fetchClient(validatedParams);
}
