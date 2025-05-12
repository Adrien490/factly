"use server";

import db from "@/shared/lib/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
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
	"use cache";

	// Tag de base pour toutes les organisations de l'utilisateur
	cacheTag(`organizations`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`organizations:search:${params.search}`);
	}

	// Tag pour le tri - toujours présent car les valeurs par défaut sont définies
	cacheTag(`organizations:sort:${params.sortBy}:${params.sortOrder}`);

	// Tags pour les autres filtres

	try {
		// Validation des paramètres
		const where = buildWhereClause(params, userId);

		// Construction de l'orderBy en fonction du champ de tri
		const orderBy =
			params.sortBy === "companyName"
				? {
						company: {
							name: params.sortOrder,
						},
					}
				: { [params.sortBy]: params.sortOrder };

		// Récupération des organisations
		const organizations = await db.organization.findMany({
			where,
			select: GET_ORGANIZATIONS_DEFAULT_SELECT,
			orderBy,
		});

		return organizations;
	} catch (error) {
		console.error("[FETCH_ORGANIZATIONS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}
