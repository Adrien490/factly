"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { countSuppliersSchema } from "../schemas";
import { fetchCount } from "./fetch-count";

/**
 * Compte le nombre de fournisseurs selon les critères de recherche et de filtrage
 * @param params - Paramètres validés par countSuppliersSchema
 * @returns Nombre de fournisseurs
 */
export async function countSuppliers(
	params: z.infer<typeof countSuppliersSchema>
): Promise<number> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Appel à la fonction
		return await fetchCount(params);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
