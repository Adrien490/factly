import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getProductCategoriesSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";
import { buildSearchConditions } from "./build-search-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma
 * @param params - Paramètres validés de la requête
 * @returns Clause WHERE Prisma complète
 */
export const buildWhereClause = (
	params: z.infer<typeof getProductCategoriesSchema>
): Prisma.ProductCategoryWhereInput => {
	// Condition de base qui doit toujours être respectée
	const whereClause: Prisma.ProductCategoryWhereInput = {
		organizationId: params.organizationId as string,
	};

	// Priorité 1: Si rootOnly est true, on force parentId à null (catégories racines)
	if (params.rootOnly === true) {
		whereClause.parentId = null;
	}
	// Priorité 2: Sinon, si parentId est spécifié, on l'utilise
	else if (params.parentId !== undefined) {
		whereClause.parentId = params.parentId;
	}

	// Ajouter les conditions de recherche textuelle
	if (typeof params.search === "string" && params.search.trim()) {
		whereClause.OR = buildSearchConditions(params.search);
	}

	// Ajouter les filtres spécifiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(params.filters || {});
		if (filterConditions.length > 0) {
			// Combiner avec AND existant ou créer un nouveau tableau AND
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
};
