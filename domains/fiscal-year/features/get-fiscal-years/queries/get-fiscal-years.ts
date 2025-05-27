"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getFiscalYearsSchema } from "../schemas";
import { fetchFiscalYears } from "./fetch-fiscal-years";

/**
 * Récupère la liste des années fiscales d'une organisation avec filtrage et recherche
 * @param searchParams - Paramètres de recherche
 * @returns Liste des années fiscales
 */
export async function getFiscalYears(
	searchParams: z.infer<typeof getFiscalYearsSchema>
) {
	// 1. Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		redirect("/auth/signin");
	}

	// 2. Validation des paramètres de recherche
	const validation = getFiscalYearsSchema.safeParse({
		search: searchParams.search as string,
		status: searchParams.status as string,
		sortBy: searchParams.sortBy as string,
		sortOrder: searchParams.sortOrder as "asc" | "desc",
	});

	if (!validation.success) {
		throw new Error("Invalid search parameters");
	}

	// 3. Appel à la fonction cacheable
	return fetchFiscalYears(validation.data);
}
