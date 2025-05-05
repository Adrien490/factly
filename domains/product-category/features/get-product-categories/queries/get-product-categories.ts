"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { getProductCategoriesSchema } from "../schemas";
import {
	GetProductCategoriesParams,
	GetProductCategoriesReturn,
	ProductCategoryFlat,
} from "../types";
import { buildCategoryTree } from "../utils";
import { fetchProductCategories } from "./fetch-product-categories";

/**
 * Fonction pour récupérer les catégories de produits avec plusieurs formats de retour
 * @param params Paramètres de recherche, filtrage et format
 * @returns Tableau de catégories au format demandé
 */
export async function getProductCategories(
	params: GetProductCategoriesParams
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
		const format = validatedParams.format || "flat";

		// Récupération des données en fonction du format
		const categories = await fetchProductCategories(validatedParams);

		if (categories.length === 0) {
			return [];
		}

		// Pour le format tree, il faut construire l'arborescence
		if (format === "tree") {
			return buildCategoryTree(categories as ProductCategoryFlat[]);
		}

		// Pour le format flat, les données sont déjà traitées par fetchProductCategories
		return categories;
	} catch (error) {
		console.error("[GET_PRODUCT_CATEGORIES]", error);
		// En cas d'erreur, renvoyer un tableau vide
		return [];
	}
}
