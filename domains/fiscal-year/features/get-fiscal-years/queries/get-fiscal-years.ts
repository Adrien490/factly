"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features/has-organization-access";
import { headers } from "next/headers";
import { z } from "zod";
import { getFiscalYearsSchema } from "../schemas";
import { GetFiscalYearsReturn } from "../types";
import { fetchFiscalYears } from "./fetch-fiscal-years";

/**
 * Récupère la liste des années fiscales d'une organisation avec filtrage et recherche
 * @param params - Paramètres validés par getFiscalYearsSchema
 * @returns Liste des années fiscales
 */
export async function getFiscalYears(
	params: z.infer<typeof getFiscalYearsSchema>
): Promise<GetFiscalYearsReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error(
				"Vous devez être connecté pour accéder aux années fiscales"
			);
		}

		// Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(params.organizationId);
		if (!hasAccess) {
			throw new Error("Vous n'avez pas accès à cette organisation");
		}

		// Validation des paramètres
		const validation = getFiscalYearsSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Paramètres invalides");
		}

		const validatedParams = validation.data;

		// Appel à la fonction de récupération
		return await fetchFiscalYears(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Paramètres invalides");
		}

		throw error;
	}
}
