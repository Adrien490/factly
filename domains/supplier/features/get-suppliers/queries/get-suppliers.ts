"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getSuppliersSchema } from "../schemas";
import { GetSuppliersReturn } from "../types";
import { fetchSuppliers } from "./fetch-suppliers";

/**
 * Récupère la liste des fournisseurs avec pagination, filtrage et recherche
 * @param params - Paramètres validés par getSuppliersSchema
 * @returns Liste des fournisseurs et informations de pagination
 */
export async function getSuppliers(
	params: z.infer<typeof getSuppliersSchema>
): Promise<GetSuppliersReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validation = getSuppliersSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Appel à la fonction avec cache
		return await fetchSuppliers(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
