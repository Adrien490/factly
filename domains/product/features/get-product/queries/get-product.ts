"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getProductSchema } from "../schemas";
import { GetProductReturn } from "../types";
import { fetchProduct } from "./fetch-product";

/**
 * Récupère les détails d'un produit spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getProduct(
	params: z.infer<typeof getProductSchema>
): Promise<GetProductReturn> {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	// Validation des paramètres
	const validation = getProductSchema.safeParse(params);
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
	return fetchProduct(validatedParams);
}
