import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { countInvitationsSchema } from "../schemas";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui compte les invitations
 */
export async function fetchCount(
	params: z.infer<typeof countInvitationsSchema>
): Promise<number> {
	"use cache";

	try {
		// Validation des paramètres
		const validation = countInvitationsSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		// Tag de base pour toutes les invitations de l'organisation
		cacheTag(`organizations:${params.organizationId}:invitations:count`);

		// Tags pour les filtres dynamiques
		if (params.filters && Object.keys(params.filters).length > 0) {
			Object.entries(params.filters).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					// Pour les filtres multivaleurs (comme les tableaux)
					cacheTag(
						`organizations:${
							params.organizationId
						}:invitations:filter:${key}:${value.join(",")}:count`
					);
				} else {
					cacheTag(
						`organizations:${params.organizationId}:invitations:filter:${key}:${value}:count`
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

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams);

		// Compter le nombre d'invitations
		const count = await db.invitation.count({ where });

		return count;
	} catch (error) {
		console.error("[COUNT_INVITATIONS]", error);
		return 0;
	}
}
