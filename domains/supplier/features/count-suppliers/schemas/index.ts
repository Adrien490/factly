import { z } from "zod";
import { supplierFiltersSchema } from "../../get-suppliers/schemas/supplier-filters-schema";

/**
 * Schéma de validation pour le comptage des fournisseurs
 * Utilise les mêmes filtres que get-suppliers pour la cohérence
 */
export const countSuppliersSchema = z.object({
	// Recherche textuelle optionnelle
	search: z.string().optional(),

	// Filtres optionnels (utilise le même schéma que get-suppliers)
	filters: supplierFiltersSchema.default({}),
});
