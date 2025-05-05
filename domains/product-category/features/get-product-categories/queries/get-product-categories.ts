"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { getProductCategoriesSchema } from "../schemas";
import {
	GetProductCategoriesParams,
	GetProductCategoriesReturn,
} from "../types";
import { fetchCategoriesFlat } from "./fetch-categories-flat";
import { fetchCategoriesTree } from "./fetch-categories-tree";

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

		// Sélection de la fonction de récupération appropriée en fonction du format
		if (format === "tree") {
			return fetchCategoriesTree(validatedParams);
		} else {
			return fetchCategoriesFlat(validatedParams);
		}
	} catch (error) {
		console.error("[GET_PRODUCT_CATEGORIES]", error);
		// En cas d'erreur, renvoyer un tableau vide
		return [];
	}
}
