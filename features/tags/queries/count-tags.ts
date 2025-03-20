"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";
import CountTagsSchema, { CountTagsParams } from "../schemas/count-tags-schema";

/**
 * Construction de la clause WHERE pour la requête Prisma
 */
const buildWhereClause = (
	params: CountTagsParams,
	userId: string
): Prisma.TagWhereInput => {
	const { organizationId, search, type } = params;

	// Clause de base: filtrer par organisation et vérifier l'accès de l'utilisateur
	const baseWhere: Prisma.TagWhereInput = {
		organizationId,
		organization: {
			members: {
				some: {
					userId,
				},
			},
		},
	};

	// Si un type spécifique est demandé
	if (type) {
		return {
			...baseWhere,
			type,
		};
	}

	// Si une recherche est demandée
	if (search) {
		const searchTerm = search.trim().toLowerCase();
		return {
			...baseWhere,
			OR: [
				{ name: { contains: searchTerm, mode: "insensitive" } },
				{ description: { contains: searchTerm, mode: "insensitive" } },
			],
		};
	}

	return baseWhere;
};

/**
 * Fonction interne cacheable qui compte les tags
 */
async function fetchTagsCount(
	params: CountTagsParams,
	userId: string
): Promise<number> {
	"use cache";

	// Configuration du cache et tags pour cette requête
	cacheLife({ stale: 1800, revalidate: 300, expire: 7200 });
	cacheTag(`organization:${params.organizationId}:tags:count`);

	if (params.type) {
		cacheTag(
			`organization:${params.organizationId}:tags:type:${params.type}:count`
		);
	}

	if (params.search) {
		cacheTag(`organization:${params.organizationId}:tags:search:count`);
	}

	try {
		// Validation des paramètres
		const validationResult = CountTagsSchema.safeParse(params);
		if (!validationResult.success) {
			console.error(
				"[FETCH_TAGS_COUNT] Erreur de validation:",
				validationResult.error
			);
			return 0;
		}

		const validParams = validationResult.data;
		const where = buildWhereClause(validParams, userId);

		// Récupération du nombre de tags
		const count = await db.tag.count({ where });
		return count;
	} catch (error) {
		console.error("[FETCH_TAGS_COUNT]", error);
		return 0;
	}
}

/**
 * Fonction publique pour compter les tags
 */
export default async function countTags(
	params: CountTagsParams
): Promise<number> {
	try {
		// Récupération de la session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			console.error("[COUNT_TAGS] Utilisateur non authentifié");
			return 0;
		}

		// Appel à la fonction cacheable avec l'ID utilisateur
		return fetchTagsCount(params, session.user.id);
	} catch (error) {
		console.error("[COUNT_TAGS]", error);
		return 0;
	}
}
