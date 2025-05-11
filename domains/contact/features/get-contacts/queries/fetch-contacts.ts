"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_CONTACTS_DEFAULT_SELECT } from "../constants";
import { getContactsSchema } from "../schemas";
import { GetContactsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les contacts
 */
export async function fetchContacts(
	params: z.infer<typeof getContactsSchema>
): Promise<GetContactsReturn> {
	"use cache";

	// Tag de base pour tous les contacts
	if (params.clientId) {
		cacheTag(
			`organizations:${params.organizationId}:clients:${params.clientId}:contacts`
		);
	} else if (params.supplierId) {
		cacheTag(
			`organizations:${params.organizationId}:suppliers:${params.supplierId}:contacts`
		);
	}

	// Tag pour la recherche textuelle
	if (params.search) {
		if (params.clientId) {
			cacheTag(
				`organizations:${params.organizationId}:clients:${params.clientId}:search:${params.search}`
			);
		} else if (params.supplierId) {
			cacheTag(
				`organizations:${params.organizationId}:suppliers:${params.supplierId}:search:${params.search}`
			);
		}
	}

	// Tag pour le tri
	if (params.clientId) {
		cacheTag(
			`organizations:${params.organizationId}:clients:${params.clientId}:sort:${params.sortBy}:${params.sortOrder}`
		);
	} else if (params.supplierId) {
		cacheTag(
			`organizations:${params.organizationId}:suppliers:${params.supplierId}:sort:${params.sortBy}:${params.sortOrder}`
		);
	}

	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				if (params.clientId) {
					cacheTag(
						`organizations:${params.organizationId}:clients:${params.clientId}:filter:${key}:${value.join(",")}`
					);
				} else if (params.supplierId) {
					cacheTag(
						`organizations:${params.organizationId}:suppliers:${params.supplierId}:filter:${key}:${value.join(",")}`
					);
				}
			} else {
				if (params.clientId) {
					cacheTag(
						`organizations:${params.organizationId}:clients:${params.clientId}:filter:${key}:${value}`
					);
				} else if (params.supplierId) {
					cacheTag(
						`organizations:${params.organizationId}:suppliers:${params.supplierId}:filter:${key}:${value}`
					);
				}
			}
		});
	}

	try {
		// Normalize parameters
		const where = buildWhereClause(params);

		// Ensure sort order is valid
		const sortOrder = params.sortOrder as Prisma.SortOrder;

		// Get data with performance tracking
		const contacts = await db.contact.findMany({
			where,
			select: GET_CONTACTS_DEFAULT_SELECT,
			orderBy: [{ [params.sortBy as string]: sortOrder }],
		});

		return contacts;
	} catch (error) {
		console.error("[FETCH_CONTACTS]", error);
		return [];
	}
}
