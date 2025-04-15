"use server";

import db from "@/shared/lib/db";
import { GET_ORGANIZATIONS_DEFAULT_SELECT } from "../constants";
import { GetOrganizationsParams, GetOrganizationsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne cacheable qui récupère les organisations
 * Prend directement l'ID utilisateur au lieu de l'extraire des headers
 */
export async function fetchOrganizations(
	params: GetOrganizationsParams,
	userId: string
): Promise<GetOrganizationsReturn> {
	try {
		// Validation des paramètres
		const where = buildWhereClause(params, userId);

		// Récupération des organisations
		const organizations = await db.organization.findMany({
			where,
			select: GET_ORGANIZATIONS_DEFAULT_SELECT,
			orderBy: { [params.sortBy]: params.sortOrder },
		});

		return organizations;
	} catch (error) {
		console.error("[FETCH_ORGANIZATIONS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}
