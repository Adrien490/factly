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
	cacheTag(`organizations:${params.organizationId}:product-categories:count`);

	// Tags spécifiques pour les options de hiérarchie
	if (params.hierarchy) {
		if (params.hierarchy.rootCategoriesOnly) {
			cacheTag(
				`organizations:${params.organizationId}:product-categories:rootOnly:count`
			);
		}

		if (params.hierarchy.withChildrenOnly) {
			cacheTag(
				`organizations:${params.organizationId}:product-categories:withChildren:count`
			);
		}

		if (params.hierarchy.leafCategoriesOnly) {
			cacheTag(
				`organizations:${params.organizationId}:product-categories:leafOnly:count`
			);
		}

		if (params.hierarchy.parentId) {
			cacheTag(
				`organizations:${params.organizationId}:product-categories:parent:${params.hierarchy.parentId}:count`
			);
		}
	}

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				cacheTag(
					`organizations:${
						params.organizationId
					}:productCategories:filter:${key}:${value.join(",")}:count`
				);
			} else {
				cacheTag(
					`organizations:${params.organizationId}:product-categories:filter:${key}:${value}:count`
				);
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
