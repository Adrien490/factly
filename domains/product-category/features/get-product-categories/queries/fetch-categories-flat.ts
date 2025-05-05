"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";
import { ProductCategoryFlat } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction qui récupère les catégories de produits au format plat
 * avec filtrage par parent et calcul optimisé du nombre d'enfants
 */
export async function fetchCategoriesFlat(
	params: z.infer<typeof getProductCategoriesSchema>
): Promise<ProductCategoryFlat[]> {
	"use cache";

	// Tags de cache - utilisation d'une clé générique commune avec fetchCategoriesTree
	cacheTag(`organizations:${params.organizationId}:productCategories`);

	if (params.search) {
		cacheTag(
			`organizations:${params.organizationId}:productCategories:search:${params.search}`
		);
	}

	cacheTag(
		`organizations:${params.organizationId}:productCategories:sort:${params.sortBy}:${params.sortOrder}`
	);

	if (params.parentId !== undefined) {
		const parentIdTag = params.parentId === null ? "root" : params.parentId;
		cacheTag(
			`organizations:${params.organizationId}:productCategories:parentId:${parentIdTag}`
		);
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

		// Appliquer directement le filtre parentId
		if (params.parentId !== undefined) {
			where.parentId = params.parentId;
		}

		// S'assurer que l'ordre de tri est valide
		const sortOrder = params.sortOrder as Prisma.SortOrder;
		const sortBy = params.sortBy;

		// Récupérer les catégories filtrées
		const categories = await db.productCategory.findMany({
			where,
			select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
			orderBy: [{ [sortBy]: sortOrder }],
		});

		// Si pas de catégories trouvées, retourner un tableau vide
		if (categories.length === 0) {
			return [];
		}

		// Récupérer le nombre d'enfants pour chaque catégorie en une seule requête
		const categoryIds = categories.map((cat) => cat.id);
		const childCounts = await db.productCategory.groupBy({
			by: ["parentId"],
			where: { parentId: { in: categoryIds } },
			_count: { id: true },
		});

		// Transformer en dictionnaire pour un accès facile
		const childCountsMap = new Map();
		childCounts.forEach((count) => {
			if (count.parentId) {
				childCountsMap.set(count.parentId, count._count.id);
			}
		});

		// Ajouter le nombre d'enfants à chaque catégorie
		return categories.map((category) => ({
			...category,
			childCount: childCountsMap.get(category.id) || 0,
			hasChildren: (childCountsMap.get(category.id) || 0) > 0,
		}));
	} catch (error) {
		console.error("[FETCH_CATEGORIES_FLAT]", error);
		return [];
	}
}
