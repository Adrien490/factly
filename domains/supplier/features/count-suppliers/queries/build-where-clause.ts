import { Prisma } from "@prisma/client";
import { z } from "zod";
import { countSuppliersSchema } from "../schemas";
import { buildFilterConditions } from "./build-filter-conditions";

/**
 * Construit la clause WHERE pour la requête Prisma
 */
export function buildWhereClause(
	params: z.infer<typeof countSuppliersSchema>
): Prisma.SupplierWhereInput {
	// Condition de base qui doit toujours être respectée
	const whereClause: Prisma.SupplierWhereInput = {
		organizationId: params.organizationId,
	};

	// Ajouter les filtres spécifiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(params.filters);
		if (filterConditions.length > 0) {
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
}
