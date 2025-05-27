"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	GET_CONTACTS_DEFAULT_SELECT,
	MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getContactsSchema } from "../schemas";
import { GetContactsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les contacts avec cache
 */
export async function fetchContacts(
	params: z.infer<typeof getContactsSchema>
): Promise<GetContactsReturn> {
	"use cache";

	// Tag de base pour tous les contacts
	if (params.clientId) {
		cacheTag(`clients:${params.clientId}:contacts`);
	} else if (params.supplierId) {
		cacheTag(`suppliers:${params.supplierId}:contacts`);
	} else {
		cacheTag(`contacts`);
	}

	// Tag pour la recherche textuelle
	if (params.search) {
		if (params.clientId) {
			cacheTag(`clients:${params.clientId}:search:${params.search}`);
		} else if (params.supplierId) {
			cacheTag(`suppliers:${params.supplierId}:search:${params.search}`);
		} else {
			cacheTag(`contacts:search:${params.search}`);
		}
	}

	// Tag pour le tri
	if (params.clientId) {
		cacheTag(
			`clients:${params.clientId}:sort:${params.sortBy}:${params.sortOrder}`
		);
	} else if (params.supplierId) {
		cacheTag(
			`suppliers:${params.supplierId}:sort:${params.sortBy}:${params.sortOrder}`
		);
	} else {
		cacheTag(`contacts:sort:${params.sortBy}:${params.sortOrder}`);
	}

	// Tag pour la pagination
	const page = Math.max(1, Number(params.page) || 1);
	const perPage = Math.min(
		Math.max(1, Number(params.perPage) || DEFAULT_PER_PAGE),
		MAX_RESULTS_PER_PAGE
	);
	cacheTag(`contacts:page:${page}:perPage:${perPage}`);

	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

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
