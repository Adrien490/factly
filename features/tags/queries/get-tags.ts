"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";
import GetTagsSchema, { GetTagsParams } from "../schemas/get-tags-schema";

/**
 * Sélection par défaut des champs pour les tags
 */
const DEFAULT_SELECT = {
	id: true,
	name: true,
	type: true,
	color: true,
	description: true,
	createdAt: true,
	updatedAt: true,
	organizationId: true,
};

export type GetTagsReturn = Array<
	Prisma.TagGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

/**
 * Construction de la clause WHERE pour la requête Prisma
 */
const buildWhereClause = (
	params: GetTagsParams,
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

	// Ajouter le filtre de recherche si présent
	if (search) {
		return {
			...baseWhere,
			OR: [
				{ name: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			],
		};
	}

	// Ajouter le filtre de type si présent
	if (type) {
		return {
			...baseWhere,
			type,
		};
	}

	return baseWhere;
};

/**
 * Fonction interne pour récupérer les tags
 */
async function fetchTags(
	params: GetTagsParams,
	userId: string
): Promise<GetTagsReturn> {
	const { sortBy = "name", sortOrder = "asc" } = params;

	// Construction de la clause WHERE
	const where = buildWhereClause(params, userId);

	// Calcul de l'offset pour la pagination

	// Récupération des tags
	const tags = await db.tag.findMany({
		where,
		select: DEFAULT_SELECT,
		orderBy: {
			[sortBy]: sortOrder,
		},
	});

	return tags;
}

/**
 * Fonction publique pour récupérer les tags
 */
export default async function getTags(
	params: GetTagsParams
): Promise<GetTagsReturn> {
	try {
		// Validation des paramètres
		const validationResult = GetTagsSchema.safeParse(params);
		if (!validationResult.success) {
			console.error("Erreur de validation:", validationResult.error);
			return [];
		}

		const validParams = validationResult.data;

		// Récupération de la session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			console.error("Utilisateur non authentifié");
			return [];
		}

		const hasAccess = await hasOrganizationAccess(validParams.organizationId);

		if (!hasAccess) {
			console.error("Accès non autorisé à l'organisation");
			return [];
		}

		// Récupération des tags avec mise en cache
		const tags = await fetchTags(validParams, session.user.id);

		// Configuration du cache
		cacheTag(`organization:${validParams.organizationId}:tags`);
		cacheLife({ stale: 60, revalidate: 60 }); // 60 secondes

		return tags;
	} catch (error) {
		console.error("Erreur lors de la récupération des tags:", error);
		return [];
	}
}
