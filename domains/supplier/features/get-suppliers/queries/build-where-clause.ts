import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSuppliersSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";
import { buildSearchConditions } from "./build-search-conditions";

/**
 * Construit la clause WHERE de la requête Prisma pour le filtrage des fournisseurs
 * Traite les filtres dynamiques, la recherche textuelle et les conditions de base
 */
export function buildWhereClause(
	params: z.infer<typeof getSuppliersSchema>
): Prisma.SupplierWhereInput {
	// Base de la clause WHERE avec l'organizationId obligatoire
	const whereClause: Prisma.SupplierWhereInput = {
		organizationId: params.organizationId,
	};

	// Traitement de la recherche textuelle si fournie
	if (typeof params.search === "string" && params.search.trim()) {
		whereClause.OR = buildSearchConditions(params.search);
	}

	// Traitement des filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(
			params.filters as Record<string, unknown>
		);
		if (filterConditions.length > 0) {
			// Combiner avec AND existant ou créer un nouveau tableau AND
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
}
