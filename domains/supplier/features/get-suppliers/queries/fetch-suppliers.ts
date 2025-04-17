"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	GET_SUPPLIERS_DEFAULT_SELECT,
	MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getSuppliersSchema } from "../schemas";
import { GetSuppliersReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les fournisseurs avec cache
 */
export async function fetchSuppliers(
	params: z.infer<typeof getSuppliersSchema>,
	userId: string
): Promise<GetSuppliersReturn> {
	"use cache";

	// Tag de base pour tous les fournisseurs de l'organisation
	cacheTag(`suppliers:${params.organizationId}:user:${userId}`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`suppliers:${params.organizationId}:search:${params.search}`);
	}

	// Tag pour le tri
	cacheTag(
		`suppliers:${params.organizationId}:sort:${params.sortBy}:${params.sortOrder}`
	);
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	// Tag pour la pagination
	const page = Math.max(1, Number(params.page) || 1);
	const perPage = Math.min(
		Math.max(1, Number(params.perPage) || DEFAULT_PER_PAGE),
		MAX_RESULTS_PER_PAGE
	);
	cacheTag(
		`suppliers:${params.organizationId}:page:${page}:perPage:${perPage}`
	);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(
					`suppliers:${params.organizationId}:filter:${key}:${value.join(",")}`
				);
			} else {
				cacheTag(`suppliers:${params.organizationId}:filter:${key}:${value}`);
			}
		});
	}

	try {
		// Construction de la clause WHERE
		const where = buildWhereClause(params);

		// Comptage du nombre total de résultats
		const total = await db.supplier.count({ where });

		// Calcul des paramètres de pagination
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Ordre de tri
		const sortOrder = (params.sortOrder as Prisma.SortOrder) || "asc";

		// Récupération des données
		const suppliers = await db.supplier.findMany({
			where,
			select: GET_SUPPLIERS_DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy: [
				{
					[String(params.sortBy) || "name"]: sortOrder,
				},
				{ id: sortOrder }, // Tri secondaire pour garantir la cohérence
			],
		});

		// Formatage de la réponse
		return {
			suppliers,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch (error) {
		console.error("[FETCH_SUPPLIERS]", error);
		return {
			suppliers: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
