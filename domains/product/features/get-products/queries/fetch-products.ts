"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	GET_PRODUCTS_DEFAULT_SELECT,
	MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getProductsSchema } from "../schemas";
import { GetProductsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Récupère les produits selon les critères fournis
 *
 * NOTE: Cette fonction est marquée "use cache" pour utiliser le cache Next.js
 * et devrait être appelée uniquement depuis une Server Action ou un Server Component
 *
 * @param params - Paramètres de recherche, filtrage et pagination
 * @returns Produits et informations de pagination
 */
export async function fetchProducts(
	params: z.infer<typeof getProductsSchema>
): Promise<GetProductsReturn> {
	"use cache";

	// Tag de base pour tous les produits de l'organisation
	cacheTag(`products`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`products:search:${params.search}`);
	}

	// Tag pour le tri
	cacheTag(`products:sort:${params.sortBy}:${params.sortOrder}`);

	// Configuration de la durée de vie du cache
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	// Tag pour la pagination
	const page = Math.max(1, Number(params.page) || 1);
	const perPage = Math.min(
		Math.max(1, Number(params.perPage) || DEFAULT_PER_PAGE),
		MAX_RESULTS_PER_PAGE
	);
	cacheTag(`products:page:${page}:perPage:${perPage}`);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(`products:filter:${key}:${value.join(",")}`);
			} else {
				cacheTag(`products:filter:${key}:${value}`);
			}
		});
	}

	try {
		// Construire la clause WHERE
		const where = buildWhereClause(params);

		// Obtenir le nombre total d'enregistrements
		const total = await db.product.count({ where });

		// Calculer les paramètres de pagination
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Obtenir le tri
		const sortOrder = params.sortOrder as Prisma.SortOrder;

		// Récupérer les données
		const products = await db.product.findMany({
			where,
			select: GET_PRODUCTS_DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy: [{ [params.sortBy]: sortOrder }],
		});

		// Retourner les résultats formatés
		return {
			products,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch (error) {
		console.error("[FETCH_PRODUCTS]", error);
		// En cas d'erreur, retourner un résultat vide avec pagination
		return {
			products: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
