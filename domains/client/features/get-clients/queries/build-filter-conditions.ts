import { ClientStatus, ClientType, Prisma } from "@prisma/client";
import { z } from "zod";
import { clientFiltersSchema } from "./../schemas/client-filters-schema";

/**
 * Construit les conditions de filtrage pour les clients
 * @param filters - Filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: z.infer<typeof clientFiltersSchema>
): Prisma.ClientWhereInput[] => {
	const conditions: Prisma.ClientWhereInput[] = [];

	// Filtre par statut
	if (filters?.status) {
		const statuses = Array.isArray(filters.status)
			? filters.status
			: [filters.status];
		conditions.push({
			status: {
				in: statuses.filter(
					(status): status is ClientStatus => status !== undefined
				),
			},
		});
	}

	// Filtre par type de client
	if (filters.type) {
		const types = Array.isArray(filters.type) ? filters.type : [filters.type];
		conditions.push({
			type: {
				in: types.filter((type): type is ClientType => type !== undefined),
			},
		});
	}

	return conditions;
};
