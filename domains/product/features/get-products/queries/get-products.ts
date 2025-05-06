"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getProductsSchema } from "../schemas";
import { GetProductsReturn } from "../types";
import { fetchProducts } from "./fetch-products";

/**
 * Récupère la liste des produits d'une organisation avec pagination, filtrage et recherche
 * @param params - Paramètres validés par getProductsSchema
 * @returns Liste des produits et informations de pagination
 */
export async function getProducts(
	params: z.infer<typeof getProductsSchema>
): Promise<GetProductsReturn> {
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
		const validation = getProductsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Requête des produits
		return await fetchProducts(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
