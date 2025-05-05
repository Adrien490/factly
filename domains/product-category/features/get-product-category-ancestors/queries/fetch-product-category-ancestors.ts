import prisma from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_PRODUCT_CATEGORY_ANCESTORS_SELECT } from "../constants";
import { getProductCategoryAncestorsSchema } from "../schemas";
import { CategoryAncestor, GetProductCategoryAncestorsReturn } from "../types";

/**
 * Fonction cacheable qui récupère les ancêtres d'une catégorie de produit
 * @param params Paramètres avec categoryId ou slug
 * @returns Liste des ancêtres ordonnés du plus proche au plus éloigné
 */
export async function fetchProductCategoryAncestors(
	params: z.infer<typeof getProductCategoryAncestorsSchema>
): Promise<GetProductCategoryAncestorsReturn> {
	"use cache";

	// Configuration du cache
	const cacheKey = params.categoryId
		? `organizations:${params.organizationId}:product-categories:${params.categoryId}:ancestors`
		: `organizations:${params.organizationId}:product-categories:slug:${params.slug}:ancestors`;

	cacheTag(cacheKey);
	cacheLife({
		revalidate: 60 * 60, // 1 heure
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24 * 7, // 7 jours
	});

	try {
		// Liste pour stocker les ancêtres
		const ancestors: CategoryAncestor[] = [];

		// Récupérer d'abord la catégorie initiale si slug est fourni
		let currentCategory;

		if (params.categoryId) {
			currentCategory = await prisma.productCategory.findUnique({
				where: {
					id: params.categoryId,
				},
				select: GET_PRODUCT_CATEGORY_ANCESTORS_SELECT,
			});
		} else if (params.slug) {
			currentCategory = await prisma.productCategory.findFirst({
				where: {
					slug: params.slug,
					organizationId: params.organizationId,
				},
				select: GET_PRODUCT_CATEGORY_ANCESTORS_SELECT,
			});
		}

		// Si la catégorie n'existe pas, retourner une liste vide
		if (!currentCategory) {
			return [];
		}

		// Récupération itérative de tous les parents
		let currentParentId: string | null = currentCategory.parentId;
		let depth = 0;

		// Limiter à maxDepth niveaux pour éviter les boucles infinies
		while (currentParentId && depth < params.maxDepth) {
			const parent = await prisma.productCategory.findUnique({
				where: { id: currentParentId },
				select: GET_PRODUCT_CATEGORY_ANCESTORS_SELECT,
			});

			if (!parent) break;

			ancestors.push({
				id: parent.id,
				name: parent.name,
				slug: parent.slug,
				parentId: parent.parentId,
			});

			currentParentId = parent.parentId;
			depth++;
		}

		return ancestors;
	} catch (error) {
		console.error("[FETCH_ANCESTORS]", error);
		return [];
	}
}
