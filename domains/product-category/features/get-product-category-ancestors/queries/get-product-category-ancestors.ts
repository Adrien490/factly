"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getProductCategoryAncestorsSchema } from "../schemas";
import { GetProductCategoryAncestorsReturn } from "../types";
import { fetchProductCategoryAncestors } from "./fetch-product-category-ancestors";

/**
 * Récupère les ancêtres d'une catégorie de produit
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getProductCategoryAncestors(
	params: z.infer<typeof getProductCategoryAncestorsSchema>
): Promise<GetProductCategoryAncestorsReturn> {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	// Validation des paramètres
	const validation = getProductCategoryAncestorsSchema.safeParse(params);
	if (!validation.success) {
		throw new Error("Invalid parameters");
	}

	const validatedParams = validation.data;

	// Vérification des droits d'accès à l'organisation
	const hasAccess = await hasOrganizationAccess(validatedParams.organizationId);

	if (!hasAccess) {
		throw new Error("Access denied");
	}

	// Appel à la fonction cacheable
	return fetchProductCategoryAncestors(validatedParams);
}
