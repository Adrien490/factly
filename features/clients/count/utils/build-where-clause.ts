import { Prisma } from "@prisma/client";
import { z } from "zod";
import { countClientsSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";
import { buildSearchConditions } from "./build-search-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma
 */
export function buildWhereClause(
	params: z.infer<typeof countClientsSchema>
): Prisma.ClientWhereInput {
	// Condition de base qui doit toujours être respectée
	const whereClause: Prisma.ClientWhereInput = {
		organizationId: params.organizationId,
	};

	// Ajouter les conditions de recherche textuelle
	if (params.search?.trim()) {
		whereClause.OR = buildSearchConditions(params.search);
	}

	// Ajouter les filtres spécifiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(params.filters);
		if (filterConditions.length > 0) {
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
}
