import { getClientsSchema } from "@/features/clients/get-list/schemas";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { buildFilterConditions } from "./build-filter-conditions";
import { buildSearchConditions } from "./build-search-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma
 * @param params - Paramètres validés de la requête
 * @returns Clause WHERE Prisma complète
 */
export const buildWhereClause = (
	params: z.infer<typeof getClientsSchema>
): Prisma.ClientWhereInput => {
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
			// Combiner avec AND existant ou créer un nouveau tableau AND
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
};
