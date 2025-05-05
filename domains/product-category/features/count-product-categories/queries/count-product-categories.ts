"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { countProductCategoriesSchema } from "../schemas";
import { CountProductCategoriesReturn } from "../types";
import { fetchCount } from "./fetch-count";

/**
 * Compte les catégories de produits d'une organisation avec des options avancées
 * pour la hiérarchie du modèle ProductCategory
 *
 * Caractéristiques:
 * - Filtrage par catégories racines/enfants/feuilles
 * - Filtrage par catégorie parente spécifique
 *
 * @param params - Paramètres validés par countProductCategoriesSchema
 * @returns Nombre de catégories correspondant aux critères
 */
export async function countProductCategories(
	params: z.infer<typeof countProductCategoriesSchema>
): Promise<CountProductCategoriesReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(params.organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction avec les options avancées
		return await fetchCount(params);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
