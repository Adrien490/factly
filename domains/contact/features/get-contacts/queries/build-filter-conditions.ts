import { Civility, Prisma } from "@prisma/client";
import { z } from "zod";
import { contactFiltersSchema } from "../schemas/contact-filters-schema";

/**
 * Construit les conditions de filtrage pour les contacts
 * @param filters - Filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: z.infer<typeof contactFiltersSchema>
): Prisma.ContactWhereInput[] => {
	const conditions: Prisma.ContactWhereInput[] = [];

	// Filtre par civilité
	if (filters?.civility) {
		const civilities = Array.isArray(filters.civility)
			? filters.civility
			: [filters.civility];
		conditions.push({
			civility: {
				in: civilities.filter(
					(civility): civility is Civility => civility !== undefined
				),
			},
		});
	}

	// Filtre par contact par défaut
	if (filters?.isDefault !== undefined) {
		conditions.push({
			isDefault: filters.isDefault,
		});
	}

	return conditions;
};
