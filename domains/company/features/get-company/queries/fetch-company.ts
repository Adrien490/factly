import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_COMPANY_DEFAULT_SELECT } from "../constants";
import { getCompanySchema } from "../schemas/get-company-schema";

/**
 * Fonction interne cacheable qui récupère une company
 * Si aucun ID n'est fourni, récupère la company principale (isMain: true)
 */
export async function fetchCompany(params: z.infer<typeof getCompanySchema>) {
	"use cache";

	// Tag de cache différent selon le type de recherche
	if (params.id) {
		cacheTag(`companies:${params.id}`);
	} else {
		cacheTag("companies:main");
	}

	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		const whereClause = params.id ? { id: params.id } : { isMain: true };

		const company = await db.company.findFirst({
			where: whereClause,
			select: GET_COMPANY_DEFAULT_SELECT,
		});

		if (!company) {
			return null;
		}

		return company;
	} catch (error) {
		console.error("[FETCH_COMPANY]", error);
		throw new Error("Failed to fetch company");
	}
}
