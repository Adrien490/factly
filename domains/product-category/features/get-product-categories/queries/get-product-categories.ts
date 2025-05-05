"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { getProductCategoriesSchema } from "../schemas";
import {
	GetProductCategoriesParams,
	GetProductCategoriesReturn,
} from "../types";
import { fetchProductCategories } from "./fetch-product-categories";

/**
 * Fonction pour récupérer les catégories de produits avec pagination et filtrage
 * @param params Paramètres de recherche et filtrage
 * @returns Catégories de produits correspondant aux critères et informations de pagination
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

		// Récupération des données
		const result = await fetchProductCategories(validatedParams);

		// Application des options de structure
		if (validatedParams.structure.asTree && result.categories.length > 0) {
			// Si la structure en arbre est demandée, transformer les données
			// Cette logique devrait être implémentée selon les besoins
			console.log("Structure en arbre demandée");
		}

		return result;
	} catch (error) {
		console.error("[GET_PRODUCT_CATEGORIES]", error);

		// En cas d'erreur, renvoyer un résultat vide
		return {
			categories: [],
			pagination: {
				page: 1,
				perPage: params.pagination?.perPage || 50,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
