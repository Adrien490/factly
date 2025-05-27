import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_PRODUCT_DEFAULT_SELECT } from "../constants";
import { getProductSchema } from "../schemas";

/**
 * Fonction interne cacheable qui récupère un produit
 */
export async function fetchProduct(params: z.infer<typeof getProductSchema>) {
	"use cache";

	// Tag de base pour tous les produits de l'organisation
	cacheTag(`products:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		const product = await db.product.findFirst({
			where: {
				id: params.id,
			},
			select: GET_PRODUCT_DEFAULT_SELECT,
		});

		if (!product) {
			return null;
		}

		return product;
	} catch (error) {
		console.error("[FETCH_PRODUCT]", error);
		throw new Error("Failed to fetch product");
	}
}
