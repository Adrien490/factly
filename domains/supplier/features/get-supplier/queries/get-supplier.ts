"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getSupplierSchema } from "../schemas";
import { fetchSupplier } from "./fetch-supplier";

/**
 * Récupère les détails d'un fournisseur spécifique
 * Gère l'authentification avant d'appeler la fonction cacheable
 */
export async function getSupplier(params: z.infer<typeof getSupplierSchema>) {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = getSupplierSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Appel à la fonction cacheable
		return fetchSupplier(validatedParams);
	} catch (error) {
		console.error("[GET_SUPPLIER]", error);
		throw error;
	}
}
