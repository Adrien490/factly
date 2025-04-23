"use server";

import db from "@/shared/lib/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { GET_FISCAL_YEARS_DEFAULT_SELECT } from "../constants";
import { GetFiscalYearsParams, GetFiscalYearsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne cacheable qui récupère les années fiscales
 * @param params Paramètres de filtrage et tri
 * @returns Liste des années fiscales
 */
export async function fetchFiscalYears(
	params: GetFiscalYearsParams
): Promise<GetFiscalYearsReturn> {
	"use cache";

	// Tag de base pour toutes les années fiscales de l'organisation
	cacheTag(`organization:${params.organizationId}:fiscal-years`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(
			`organization:${params.organizationId}:fiscal-years:search:${params.search}`
		);
	}

	// Tag pour le statut si filtré
	if (params.status) {
		cacheTag(
			`organization:${params.organizationId}:fiscal-years:status:${params.status}`
		);
	}

	// Tag pour le tri
	cacheTag(
		`organization:${params.organizationId}:fiscal-years:sort:${params.sortBy}:${params.sortOrder}`
	);

	try {
		// Construction de la clause WHERE
		const where = buildWhereClause(params);

		// Récupération des années fiscales
		const fiscalYears = await db.fiscalYear.findMany({
			where,
			select: GET_FISCAL_YEARS_DEFAULT_SELECT,
			orderBy: { [params.sortBy]: params.sortOrder },
		});

		return fiscalYears;
	} catch (error) {
		console.error("[FETCH_FISCAL_YEARS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}
