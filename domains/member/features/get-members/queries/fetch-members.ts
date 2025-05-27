import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import {
	GET_MEMBERS_DEFAULT_PER_PAGE,
	GET_MEMBERS_DEFAULT_SELECT,
	GET_MEMBERS_MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getMembersSchema } from "../schemas";
import { GetMembersReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui récupère les membres
 */
export async function fetchMembers(
	params: z.infer<typeof getMembersSchema>
): Promise<GetMembersReturn> {
	"use cache";

	// Tag de base pour tous les membres
	cacheTag(`members`);

	// Tag pour la recherche textuelle
	if (params.search) {
		cacheTag(`members:search:${params.search}`);
	}

	// Tag pour le tri
	cacheTag(`members:sort:${params.sortBy}:${params.sortOrder}`);
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	// Tag pour la pagination
	const page = Math.max(1, Number(params.page) || 1);
	const perPage = Math.min(
		Math.max(1, Number(params.perPage) || GET_MEMBERS_DEFAULT_PER_PAGE),
		GET_MEMBERS_MAX_RESULTS_PER_PAGE
	);
	cacheTag(`members:page:${page}:perPage:${perPage}`);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(`members:filter:${key}:${value.join(",")}`);
			} else {
				cacheTag(`members:filter:${key}:${value}`);
			}
		});
	}

	try {
		// Normalize pagination parameters
		const where = buildWhereClause(params);

		// Get total count with performance tracking
		const total = await db.member.count({ where });

		// Calculate pagination parameters
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Ensure sort order is valid
		const sortOrder = params.sortOrder as Prisma.SortOrder;

		// Construire l'orderBy en fonction du champ de tri
		let orderBy: Prisma.MemberOrderByWithRelationInput;
		if (params.sortBy === "user") {
			orderBy = { user: { name: sortOrder } };
		} else {
			orderBy = { [params.sortBy]: sortOrder };
		}

		// Get data with performance tracking
		const members = await db.member.findMany({
			where,
			select: GET_MEMBERS_DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy,
		});

		// Transforming members to match expected return type
		return {
			members,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch {
		return {
			members: [],
			pagination: {
				page: 1,
				perPage: GET_MEMBERS_DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
