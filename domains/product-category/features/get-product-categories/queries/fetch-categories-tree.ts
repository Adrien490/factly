"use server";

import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";
import { ProductCategoryTree } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction qui récupère les catégories de produits et construit
 * une structure arborescente hiérarchique directement
 */
export async function fetchCategoriesTree(
	params: z.infer<typeof getProductCategoriesSchema>
): Promise<ProductCategoryTree[]> {
	"use cache";

	// Tags de cache - utilisation d'une clé générique commune avec fetchCategoriesFlat
	cacheTag(`organizations:${params.organizationId}:productCategories`);

	if (params.search) {
		cacheTag(
			`organizations:${params.organizationId}:productCategories:search:${params.search}`
		);
	}

	cacheTag(
		`organizations:${params.organizationId}:productCategories:sort:${params.sortBy}:${params.sortOrder}`
	);

	// Durée de vie du cache
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		// Construire la clause WHERE de base (sans filtrer par parentId)
		const where = buildWhereClause(params);

		// Retirer le parentId du where car nous allons construire l'arbre complet
		// et le filtrage se fera après construction
		if (where.parentId) {
			delete where.parentId;
		}

		// S'assurer que l'ordre de tri est valide
		const sortOrder = params.sortOrder as Prisma.SortOrder;
		const sortBy = params.sortBy;

		// Récupérer toutes les catégories nécessaires pour l'arborescence
		const allCategories = await db.productCategory.findMany({
			where,
			select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
			orderBy: [{ [sortBy]: sortOrder }],
		});

		// Si pas de catégories trouvées, retourner un tableau vide
		if (allCategories.length === 0) {
			return [];
		}

		// Construire l'arborescence directement dans cette fonction
		// plutôt que de déléguer à un utilitaire séparé

		// Fonction interne pour construire l'arbre de façon récursive
		const buildTree = (parentId: string | null): ProductCategoryTree[] => {
			// Trouver toutes les catégories qui ont ce parent
			const children = allCategories.filter((cat) => cat.parentId === parentId);

			// Pour chaque catégorie enfant, construire récursivement ses propres enfants
			return children.map((child) => {
				// Construire les enfants de cette catégorie
				const childCategories = buildTree(child.id);

				// Retourner la catégorie enrichie avec ses enfants
				return {
					...child,
					childCount: childCategories.length,
					hasChildren: childCategories.length > 0,
					children: childCategories.length > 0 ? childCategories : undefined,
				};
			});
		};

		// Construire l'arbre complet à partir du niveau spécifié
		// Si parentId est défini, commencer depuis ce niveau, sinon partir des racines
		const rootId = params.parentId !== undefined ? params.parentId : null;
		const tree = buildTree(rootId);

		return tree;
	} catch (error) {
		console.error("[FETCH_CATEGORIES_TREE]", error);
		return [];
	}
}
