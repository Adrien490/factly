import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { countClientsSchema } from "../schemas";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui compte les clients
 */
export async function fetchCount(
	params: z.infer<typeof countClientsSchema>
): Promise<number> {
	"use cache";

	// Tag de base pour tous les clients de l'organisation
	cacheTag(`organizations:${params.organizationId}:clients:count`);

	// Tags pour les filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Pour les filtres multivaleurs (comme les tableaux)
				cacheTag(
					`organizations:${params.organizationId}:filter:${key}:${value.join(
						","
					)}:count`
				);
			} else {
				cacheTag(
					`organizations:${params.organizationId}:filter:${key}:${value}:count`
				);
			}
		});
	}

	// Définir la durée de vie du cache
	cacheLife({
		revalidate: 60 * 60, // Revalidate after 1 hour
		stale: 60 * 5, // Stale after 5 minutes
		expire: 60 * 60 * 24, // Expire after 1 day
	});

	try {
		// Validation des paramètres
		const validation = countClientsSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams);

		// Compter le nombre de clients
		const count = await db.client.count({ where });

		return count;
	} catch (error) {
		console.error("[COUNT_CLIENTS]", error);
		return 0;
	}
}
