"use server";

import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";
import { GetProductCategoriesReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les catégories de produits
 */
export async function fetchProductCategories(
	params: z.infer<typeof getProductCategoriesSchema>
): Promise<GetProductCategoriesReturn> {
	"use cache";

	// Tag de base pour toutes les catégories de produits de l'organisation
	cacheTag(`organizations:${params.organizationId}:product-categories`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`organizations:${params.organizationId}:search:${params.search}`);
	}

	// Tag pour filtrer par parent
	if (params.parentId) {
		cacheTag(
			`organizations:${params.organizationId}:parentId:${params.parentId}`
		);
	}

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(
					`organizations:${params.organizationId}:filter:${key}:${value.join(
						","
					)}`
				);
			} else {
				cacheTag(
					`organizations:${params.organizationId}:filter:${key}:${value}`
				);
			}
		});
	}

	// Durée de vie du cache
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		// Construire la clause WHERE
		const where = buildWhereClause(params);

		// Récupérer les catégories
		const categories = await db.productCategory.findMany({
			where,
			select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
			orderBy: [
				{ name: "asc" }, // Tri principal par nom
				{ id: "asc" }, // Tri secondaire par ID pour garantir la cohérence
			],
		});

		return categories;
	} catch (error) {
		console.error("[FETCH_PRODUCT_CATEGORIES]", error);
		return [];
	}
}
