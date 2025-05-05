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
 * Fonction pour récupérer les catégories de produits avec navigation par dossier
 * @param params Paramètres de recherche et filtrage
 * @returns Tableau de catégories filtré selon le niveau de dossier spécifié
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

		// Récupération des données brutes
		const allCategories = await fetchProductCategories(validatedParams);

		// Navigation par dossier simplifiée
		if (allCategories.length > 0) {
			// 1. Filtrer les catégories du niveau courant (défini par parentId)
			const currentLevelCategories = allCategories.filter(
				(category) => category.parentId === validatedParams.parentId
			);

			// 2. Enrichir chaque catégorie avec les données demandées
			return Promise.all(
				currentLevelCategories.map(async (category) => {
					const result = { ...category };

					// Par défaut, toujours inclure le nombre d'enfants sauf si explicitement désactivé
					const shouldIncludeChildCount =
						!validatedParams.include ||
						validatedParams.include.childCount === undefined ||
						validatedParams.include.childCount === true;

					if (shouldIncludeChildCount) {
						const childCount = allCategories.filter(
							(c) => c.parentId === category.id
						).length;
						result.childCount = childCount;
						result.hasChildren = childCount > 0;
					}

					return result;
				})
			);
		}

		return allCategories;
	} catch (error) {
		console.error("[GET_PRODUCT_CATEGORIES]", error);
		// En cas d'erreur, renvoyer un tableau vide
		return [];
	}
}
