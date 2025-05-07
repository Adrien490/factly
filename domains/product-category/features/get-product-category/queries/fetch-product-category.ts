import prisma from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { getProductCategorySchema } from "../schemas";
import { GetProductCategoryReturn } from "../types";

/**
 * Fonction cacheable qui récupère une catégorie de produit spécifique
 * @param params Paramètres avec id ou slug
 * @returns Objet contenant la catégorie ou null si non trouvée
 */
export async function fetchProductCategory(
	params: z.infer<typeof getProductCategorySchema>
): Promise<GetProductCategoryReturn> {
	"use cache";

	// Configuration du cache
	const cacheKey = `organizations:${params.organizationId}:product-categories:id:${params.id}`;

	cacheTag(cacheKey);
	cacheLife({
		revalidate: 60 * 60, // 1 heure
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24 * 7, // 7 jours
	});

	try {
		// Préparation des conditions de recherche basées sur id ou slug
		let whereCondition: Prisma.ProductCategoryWhereInput = {
			organizationId: params.organizationId,
		};

		// Priorité à l'id s'il est fourni, sinon utiliser le slug
		if (params.id) {
			whereCondition = {
				...whereCondition,
				id: params.id,
			};
		}
		// Récupération de la catégorie
		const category = await prisma.productCategory.findFirst({
			where: whereCondition,
		});

		// Si la catégorie n'existe pas
		if (!category) {
			return null;
		}

		return category;
	} catch (error) {
		console.error("[FETCH_PRODUCT_CATEGORY]", error);
		return null;
	}
}
