import { Prisma } from "@prisma/client";
import { z } from "zod";
import { memberFiltersSchema } from "../schemas/member-filters-schema";

/**
 * Construit les conditions de filtrage pour les membres
 * @param filters - Filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: z.infer<typeof memberFiltersSchema>
): Prisma.MemberWhereInput[] => {
	const conditions: Prisma.MemberWhereInput[] = [];

	// Filtre par statut de vérification email
	if (filters?.emailVerified !== undefined) {
		conditions.push({
			user: {
				emailVerified: filters.emailVerified,
			},
		});
	}

	return conditions;
};
