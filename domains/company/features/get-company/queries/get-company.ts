"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getCompanySchema } from "../schemas/get-company-schema";
import { GetCompanyReturn } from "../types";
import { fetchCompany } from "./fetch-company";

/**
 * Récupère les détails d'une company spécifique
 * Si un ID est fourni, récupère la company correspondante
 * Si aucun ID n'est fourni, récupère la company principale (isMain: true)
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getCompany(
	params: z.infer<typeof getCompanySchema> = {}
): Promise<GetCompanyReturn> {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	// Validation des paramètres
	const validation = getCompanySchema.safeParse(params);
	if (!validation.success) {
		throw new Error("Invalid parameters");
	}

	const validatedParams = validation.data;

	// Appel à la fonction cacheable
	return fetchCompany(validatedParams);
}
