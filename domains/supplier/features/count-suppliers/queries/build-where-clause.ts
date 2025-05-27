import { Prisma } from "@prisma/client";
import { z } from "zod";
import { buildSearchConditions } from "../../get-suppliers/queries/build-search-conditions";
import { countSuppliersSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma
 */
export function buildWhereClause(
	params: z.infer<typeof countSuppliersSchema>
): Prisma.SupplierWhereInput {
	// Condition de base
	const whereClause: Prisma.SupplierWhereInput = {};

	// Ajouter les conditions de recherche textuelle
	if (typeof params.search === "string" && params.search.trim()) {
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
