"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getFiscalYearSchema } from "../schemas";
import { GetFiscalYearReturn } from "../types";
import { fetchFiscalYear } from "./fetch-fiscal-year";

/**
 * Récupère les détails d'une année fiscale spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getFiscalYear(
	params: z.infer<typeof getFiscalYearSchema>
): Promise<GetFiscalYearReturn> {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	// Validation des paramètres
	const validation = getFiscalYearSchema.safeParse(params);
	if (!validation.success) {
		throw new Error("Invalid parameters");
	}

	const validatedParams = validation.data;

	// Vérification des droits d'accès à l'organisation
	const hasAccess = await hasOrganizationAccess(validatedParams.organizationId);

	if (!hasAccess) {
		throw new Error("Access denied");
	}

	// Appel à la fonction cacheable
	return fetchFiscalYear(validatedParams);
}
