import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getContactsSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";
import { buildSearchConditions } from "./build-search-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma
 * @param params - Paramètres validés de la requête
 * @returns Clause WHERE Prisma complète
 */
export const buildWhereClause = (
	params: z.infer<typeof getContactsSchema>
): Prisma.ContactWhereInput => {
	// Condition de base qui doit toujours être respectée
	const baseConditions: Prisma.ContactWhereInput[] = [
		// Condition pour les contacts d'un client
		...(params.clientId
			? [
					{
						clientId: params.clientId,
						client: {
							organizationId: params.organizationId,
						},
					},
				]
			: []),
		// Condition pour les contacts d'un fournisseur
		...(params.supplierId
			? [
					{
						supplierId: params.supplierId,
						supplier: {
							organizationId: params.organizationId,
						},
					},
				]
			: []),
	];

	const whereClause: Prisma.ContactWhereInput = {
		OR: baseConditions,
	};

	// Ajouter les conditions de recherche textuelle
	if (typeof params.search === "string" && params.search.trim()) {
		whereClause.OR = [
			...baseConditions,
			...buildSearchConditions(params.search),
		];
	}

	// Ajouter les filtres spécifiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(
			params.filters as Record<string, unknown>
		);
		if (filterConditions.length > 0) {
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
};
