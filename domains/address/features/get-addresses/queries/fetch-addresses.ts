"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_ADDRESSES_DEFAULT_SELECT } from "../constants";
import { getAddressesSchema } from "../schemas";
import { GetAddressesReturn } from "../types";
import { buildFilterConditions } from "./build-filter-conditions";

/**
 * Fonction interne qui récupère les adresses avec cache
 * Version sans pagination pour récupérer toutes les adresses d'un client ou fournisseur
 */
export async function fetchAddresses(
	params: z.infer<typeof getAddressesSchema>
): Promise<GetAddressesReturn> {
	"use cache";

	// Tag de base
	if (params.clientId) {
		cacheTag(
			`organizations:${params.organizationId}:clients:${params.clientId}:addresses`
		);
	}

	if (params.supplierId) {
		cacheTag(
			`organizations:${params.organizationId}:suppliers:${params.supplierId}:addresses`
		);
	}

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(
			`organizations:${params.organizationId}:addresses:search:${params.search}`
		);
	}

	// Tag pour le tri
	cacheTag(
		`organizations:${params.organizationId}:addresses:sort:${params.sortBy}:${params.sortOrder}`
	);

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
		const where: Prisma.AddressWhereInput = {};

		// Ajout des identifiants relationnels
		if (params.clientId) {
			where.clientId = params.clientId;
		}

		if (params.supplierId) {
			where.supplierId = params.supplierId;
		}

		// Traitement de la recherche textuelle si fournie
		if (params.search && params.search.trim() !== "") {
			const searchTerm = params.search.trim();
			where.OR = [
				{ addressLine1: { contains: searchTerm, mode: "insensitive" } },
				{ addressLine2: { contains: searchTerm, mode: "insensitive" } },
				{ city: { contains: searchTerm, mode: "insensitive" } },
				{ postalCode: { contains: searchTerm, mode: "insensitive" } },
			];
		}

		// Application des filtres
		if (params.filters && Object.keys(params.filters).length > 0) {
			const filterConditions = buildFilterConditions(params.filters);
			if (filterConditions.length > 0) {
				if (!where.AND) where.AND = [];
				(where.AND as Prisma.AddressWhereInput[]).push(...filterConditions);
			}
		}

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
