"use server";

import db from "@/shared/lib/db";
import { revalidateTag } from "next/cache";
import { GET_FISCAL_YEARS_DEFAULT_SELECT } from "../constants";
import { GetFiscalYearsParams, GetFiscalYearsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

export async function fetchFiscalYears(
	params: GetFiscalYearsParams
): Promise<GetFiscalYearsReturn> {
	"use cache";

	// Tag de base pour toutes les années fiscales de l'organisation
	revalidateTag(`fiscal-years`);

	// Tag pour la recherche textuelle
	if (params.search) {
		revalidateTag(`fiscal-years:search:${params.search}`);
	}

	// Tag pour le statut si filtré
	if (params.status) {
		revalidateTag(`fiscal-years:status:${params.status}`);
	}

	// Tag pour le tri
	revalidateTag(`fiscal-years:sort:${params.sortBy}:${params.sortOrder}`);

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
