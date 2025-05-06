import { z } from "zod";
import { supplierStatusSchema } from "./supplier-status-schema";
import { supplierTypeSchema } from "./supplier-type-schema";

// Schéma pour les filtres de texte simples
const textFilterSchema = z.union([z.string(), z.array(z.string())]);

// Schéma pour les filtres de fournisseurs avec validation
export const supplierFiltersSchema = z
	.object({
		// Filtres avec validation spéciale
		status: supplierStatusSchema.optional(),
		supplierType: supplierTypeSchema.optional(),

		// Filtres textuels simples
		name: textFilterSchema.optional(),
		legalName: textFilterSchema.optional(),
		email: textFilterSchema.optional(),
		siret: textFilterSchema.optional(),
		siren: textFilterSchema.optional(),
	})
	.passthrough(); // Permet d'autres propriétés
