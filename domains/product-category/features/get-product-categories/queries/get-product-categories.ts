"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getProductCategoriesSchema } from "../schemas";
import { GetProductCategoriesReturn } from "../types";
import { fetchProductCategories } from "./fetch-product-categories";

/**
 * Récupère la liste des catégories de produits d'une organisation
 * @param params - Paramètres validés par getProductCategoriesSchema
 * @returns Liste des catégories de produits
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

		const validation = getProductCategoriesSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		return await fetchProductCategories(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
