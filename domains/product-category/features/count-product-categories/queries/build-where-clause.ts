import { Prisma } from "@prisma/client";
import { z } from "zod";
import { countProductCategoriesSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma en tenant compte
 * de la structure hiérarchique des catégories de produits
 */
export function buildWhereClause(
	params: z.infer<typeof countProductCategoriesSchema>
): Prisma.ProductCategoryWhereInput {
	// Condition de base qui doit toujours être respectée
	const whereClause: Prisma.ProductCategoryWhereInput = {
		organizationId: params.organizationId,
	};

	// Application des options de hiérarchie
	if (params.hierarchy) {
		// 1. Catégories de premier niveau uniquement (root)
		if (params.hierarchy.rootCategoriesOnly) {
			whereClause.parentId = null;
		}

		// 2. Filtrage par catégorie parente spécifique
		else if (params.hierarchy.parentId !== undefined) {
			whereClause.parentId = params.hierarchy.parentId;
		}

		// 3. Catégories ayant des enfants
		if (params.hierarchy.withChildrenOnly) {
			whereClause.children = {
				some: {},
			};
		}

		// 4. Catégories feuilles (sans enfants)
		if (params.hierarchy.leafCategoriesOnly) {
			whereClause.children = {
				none: {},
			};
		}
	}

	// Ajouter les filtres spécifiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(params.filters);
		if (filterConditions.length > 0) {
			if (!whereClause.AND) {
				whereClause.AND = [];
			}
			if (Array.isArray(whereClause.AND)) {
				whereClause.AND.push(...filterConditions);
			} else {
				whereClause.AND = [whereClause.AND, ...filterConditions];
			}
		}
	}

	return whereClause;
}
