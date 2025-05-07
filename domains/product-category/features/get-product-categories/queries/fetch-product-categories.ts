"use server";

import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
	MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getProductCategoriesSchema } from "../schemas";
import { GetProductCategoriesReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction qui récupère les catégories de produits
 * avec filtrage par parent et calcul optimisé du nombre d'enfants
 */
export async function fetchProductCategories(
	params: z.infer<typeof getProductCategoriesSchema>
): Promise<GetProductCategoriesReturn> {
	"use cache";

	// Tags de cache
	cacheTag(`organizations:${params.organizationId}:product-categories`);

	if (params.search) {
		cacheTag(
			`organizations:${params.organizationId}:product-categories:search:${params.search}`
		);
	}

	cacheTag(
		`organizations:${params.organizationId}:product-categories:sort:${params.sortBy}:${params.sortOrder}`
	);

	// Normalisation et tag pour la pagination
	const page = Math.max(1, Number(params.page) || 1);
	const perPage = Math.min(
		Math.max(1, Number(params.perPage) || DEFAULT_PER_PAGE),
		MAX_RESULTS_PER_PAGE
	);
	cacheTag(
		`organizations:${params.organizationId}:product-categories:page:${page}:perPage:${perPage}`
	);

	// Durée de vie du cache
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		// Construire la clause WHERE
		const where = buildWhereClause(params);

		// Appliquer l'ordre de tri avec des valeurs par défaut
		const sortOrder = params.sortOrder || "asc";
		const sortBy = params.sortBy || "name";

		// Obtenir le nombre total de catégories pour la pagination
		const total = await db.productCategory.count({ where });

		// Calculer les paramètres de pagination
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Récupérer les catégories filtrées avec pagination
		const categories = await db.productCategory.findMany({
			where,
			select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
			orderBy: [{ [sortBy]: sortOrder }],
			take: perPage,
			skip,
		});

		// Si pas de catégories trouvées, retourner un tableau vide
		if (categories.length === 0) {
			return {
				categories: [],
				pagination: {
					page: currentPage,
					perPage,
					total: 0,
					pageCount: 0,
				},
			};
		}

		return {
			categories,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch (error) {
		console.error("[FETCH_CATEGORIES]", error);
		return {
			categories: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
