"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_ADDRESSES_DEFAULT_SELECT } from "../constants";
import { getAddressesSchema } from "../schemas";
import { GetAddressesReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les adresses avec cache
 * Version sans pagination pour récupérer toutes les adresses d'un client ou fournisseur
 */
export async function fetchAddresses(
	params: z.infer<typeof getAddressesSchema>,
	userId: string
): Promise<GetAddressesReturn> {
	"use cache";

	// Tag de base
	if (params.clientId) {
		cacheTag(`client:${params.clientId}:addresses:user:${userId}`);
	}

	if (params.supplierId) {
		cacheTag(`supplier:${params.supplierId}:addresses:user:${userId}`);
	}

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`addresses:search:${params.search}`);
	}

	// Tag pour le tri
	cacheTag(`addresses:sort:${params.sortBy}:${params.sortOrder}`);

	// Durée de vie du cache
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				cacheTag(`addresses:filter:${key}:${value.join(",")}`);
			} else {
				cacheTag(`addresses:filter:${key}:${value}`);
			}
		});
	}

	try {
		// Construction de la clause WHERE
		const where = buildWhereClause(params);

		// Ordre de tri
		const sortOrder = (params.sortOrder as Prisma.SortOrder) || "asc";

		// Récupération des données sans pagination
		const addresses = await db.address.findMany({
			where,
			select: GET_ADDRESSES_DEFAULT_SELECT,
			orderBy: [
				{
					[String(params.sortBy) || "createdAt"]: sortOrder,
				},
				{ id: sortOrder }, // Tri secondaire pour garantir la cohérence
			],
		});

		return addresses;
	} catch (error) {
		console.error("[FETCH_ADDRESSES]", error);
		return [];
	}
}
