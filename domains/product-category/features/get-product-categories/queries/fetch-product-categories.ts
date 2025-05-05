"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";
import { GetProductCategoriesReturn, ProductCategoryFlat } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les catégories de produits
 * en adaptant la stratégie de récupération selon le format demandé
 */
export async function fetchProductCategories(
	params: z.infer<typeof getProductCategoriesSchema>
): Promise<GetProductCategoriesReturn> {
	"use cache";

	// Tag de base pour toutes les catégories de produits de l'organisation
	cacheTag(`organizations:${params.organizationId}:productCategories`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(
			`organizations:${params.organizationId}:productCategories:search:${params.search}`
		);
	}

	// Tag pour le tri
	cacheTag(
		`organizations:${params.organizationId}:productCategories:sort:${params.sortBy}:${params.sortOrder}`
	);

	// Tag pour filtrer par parent
	if (params.parentId !== undefined) {
		const parentIdTag = params.parentId === null ? "root" : params.parentId;
		cacheTag(
			`organizations:${params.organizationId}:productCategories:parentId:${parentIdTag}`
		);
	}

	// Tag pour le format
	cacheTag(
		`organizations:${params.organizationId}:productCategories:format:${
			params.format || "flat"
		}`
	);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(
					`organizations:${
						params.organizationId
					}:productCategories:filter:${key}:${value.join(",")}`
				);
			} else {
				cacheTag(
					`organizations:${params.organizationId}:productCategories:filter:${key}:${value}`
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
		// Construire la clause WHERE de base
		const where = buildWhereClause(params);

		// S'assurer que l'ordre de tri est valide
		const sortOrder = params.sortOrder as Prisma.SortOrder;
		const sortBy = params.sortBy;
		const format = params.format || "flat";

		// Récupération selon le format demandé
		if (format === "flat") {
			// FORMAT FLAT: Récupérer les catégories comme une liste plate
			// Si parentId est défini, filtrer directement au niveau de la requête
			if (params.parentId !== undefined) {
				where.parentId = params.parentId;
			}

			const categories = await db.productCategory.findMany({
				where,
				select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
				orderBy: [{ [sortBy]: sortOrder }],
			});

			// Enrichir les catégories avec le nombre d'enfants
			if (categories.length > 0) {
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
				})) as ProductCategoryFlat[];
			}

			return categories as ProductCategoryFlat[];
		} else if (format === "tree") {
			// FORMAT TREE: Retourner toutes les catégories et construire l'arborescence côté client
			// Toujours récupérer toutes les catégories pour pouvoir construire l'arbre complet
			const categories = await db.productCategory.findMany({
				where: {
					// Garder seulement le filtre d'organisation et les autres filtres,
					// mais pas le parentId qui sera géré dans la construction de l'arbre
					organizationId: where.organizationId,
					...(where.name ? { name: where.name } : {}),
					...(where.status ? { status: where.status } : {}),
					// Ajouter d'autres filtres si nécessaire...
				},
				select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
				orderBy: [{ [sortBy]: sortOrder }],
			});

			// Retourner les catégories pour construction côté client
			// Le format tree sera construit par la fonction getProductCategories
			return categories as ProductCategoryFlat[];
		}

		// Format non reconnu - utiliser flat par défaut
		return [];
	} catch (error) {
		console.error("[FETCH_PRODUCT_CATEGORIES]", error);
		return [];
	}
}
