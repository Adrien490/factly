import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { countProductCategoriesSchema } from "../schemas";
import { CountProductCategoriesReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui compte les catégories de produits avec des fonctionnalités avancées
 * pour tenir compte de la structure hiérarchique
 */
export async function fetchCount(
	params: z.infer<typeof countProductCategoriesSchema>
): Promise<CountProductCategoriesReturn> {
	"use cache";

	// Tag de base pour toutes les catégories de l'organisation
	cacheTag(`product-categories:count`);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				cacheTag(`product-categories:filter:${key}:${value.join(",")}:count`);
			} else {
				cacheTag(`product-categories:filter:${key}:${value}:count`);
			}
		});
	}

	// Définir la durée de vie du cache
	cacheLife({
		revalidate: 60 * 60, // Revalidate after 1 hour
		stale: 60 * 5, // Stale after 5 minutes
		expire: 60 * 60 * 24, // Expire after 1 day
	});

	try {
		// Validation des paramètres
		const validation = countProductCategoriesSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams);

		// Comptage simple des catégories
		const count = await db.productCategory.count({ where });
		return count;
	} catch (error) {
		console.error("[COUNT_PRODUCT_CATEGORIES]", error);
		return 0;
	}
}
