"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	GET_CLIENTS_DEFAULT_SELECT,
	MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getClientsSchema } from "../schemas";
import { GetClientsReturn } from "../types";
import { buildWhereClause } from "./build-where-claude";

/**
 * Fonction interne qui récupère les clients
 */
export async function fetchClients(
	params: z.infer<typeof getClientsSchema>,
	userId: string
): Promise<GetClientsReturn> {
	"use cache";

	console.log(userId);

	// Tag de base pour tous les clients de l'organisation
	cacheTag(`organization:${params.organizationId}:clients`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`organization:${params.organizationId}:search:${params.search}`);
	}

	// Tag pour le tri
	cacheTag(
		`organization:${params.organizationId}:sort:${params.sortBy}:${params.sortOrder}`
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
		`organization:${params.organizationId}:page:${page}:perPage:${perPage}`
	);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(
					`organization:${params.organizationId}:filter:${key}:${value.join(
						","
					)}`
				);
			} else {
				cacheTag(
					`organization:${params.organizationId}:filter:${key}:${value}`
				);
			}
		});
	}

	try {
		// Normalize pagination parameters
		const where = buildWhereClause(params);

		// Get total count with performance tracking
		const total = await db.client.count({ where });

		// Calculate pagination parameters
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Ensure sort order is valid
		const sortOrder = (params.sortOrder as Prisma.SortOrder) || "asc";

		// Get data with performance tracking
		const clients = await db.client.findMany({
			where,
			select: GET_CLIENTS_DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy: [
				{
					[String(params.sortBy) || "name"]: sortOrder,
				},
				{ id: sortOrder }, // Toujours ajouter un tri secondaire pour garantir la cohérence
			],
		});

		// Transforming clients to match expected return type
		return {
			clients,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch (error) {
		console.error("[FETCH_CLIENTS]", error);
		return {
			clients: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
