"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getProductCategorySchema } from "../schemas";
import { GetProductCategoryReturn } from "../types";
import { fetchProductCategory } from "./fetch-product-category";

/**
 * Récupère les détails d'une catégorie de produit spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getProductCategory(
	params: z.infer<typeof getProductCategorySchema>
): Promise<GetProductCategoryReturn> {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	// Validation des paramètres
	const validation = getProductCategorySchema.safeParse(params);
	if (!validation.success) {
		throw new Error("Invalid parameters");
	}

	const validatedParams = validation.data;

	// Appel à la fonction cacheable
	return fetchProductCategory(validatedParams);
}
