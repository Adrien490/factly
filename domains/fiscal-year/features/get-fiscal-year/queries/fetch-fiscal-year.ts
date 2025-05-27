import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_FISCAL_YEAR_DEFAULT_SELECT } from "../constants";
import { getFiscalYearSchema } from "../schemas";

/**
 * Fonction interne cacheable qui récupère une année fiscale
 */
export async function fetchFiscalYear(
	params: z.infer<typeof getFiscalYearSchema>
) {
	"use cache";

	// Tag de base pour toutes les années fiscales de l'organisation
	cacheTag(`fiscal-year:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24, // 24 heures
	});

	try {
		const fiscalYear = await db.fiscalYear.findFirst({
			where: {
				id: params.id,
			},
			select: GET_FISCAL_YEAR_DEFAULT_SELECT,
		});

		if (!fiscalYear) {
			return null;
		}

		return fiscalYear;
	} catch (error) {
		console.error("[FETCH_FISCAL_YEAR]", error);
		throw new Error("Failed to fetch fiscal year");
	}
}
