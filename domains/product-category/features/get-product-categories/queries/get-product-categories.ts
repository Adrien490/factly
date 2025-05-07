"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getProductCategoriesSchema } from "../schemas";
import { GetProductCategoriesReturn } from "../types";
import { fetchProductCategories } from "./fetch-product-categories";

/**
 * Fonction pour récupérer les catégories de produits
 * @param params Paramètres de recherche et filtrage
 * @returns Tableau de catégories
 */
export async function getProductCategories(
	params: z.infer<typeof getProductCategoriesSchema>
): Promise<GetProductCategoriesReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(
			params.organizationId as string
		);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Validation des paramètres
		const validation = getProductCategoriesSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Paramètres invalides");
		}

		const validatedParams = validation.data;

		// Récupération des catégories
		return fetchProductCategories(validatedParams);
	} catch (error) {
		console.error("[GET_PRODUCT_CATEGORIES]", error);
		// En cas d'erreur, renvoyer un tableau vide
		return {
			categories: [],
			pagination: {
				page: 1,
				perPage: 10,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
