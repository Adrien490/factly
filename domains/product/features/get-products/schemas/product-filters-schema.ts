import { z } from "zod";
import { productStatusSchema } from "./product-status-schema";
import { productVatRateSchema } from "./product-vat-rate-schema";

// Schéma pour les filtres de texte simples
const textFilterSchema = z.union([z.string(), z.array(z.string())]);

// Schéma pour les filtres numériques
const numericFilterSchema = z.union([
	z.number(),
	z.string().transform((val) => parseFloat(val) || undefined),
	z.array(z.number()),
	z.array(z.string().transform((val) => parseFloat(val) || undefined)),
]);

// Schéma pour les filtres de produits avec validation
export const productFiltersSchema = z
	.object({
		// Filtres avec validation spéciale
		status: productStatusSchema.optional(),
		vatRate: productVatRateSchema.optional(),

		// Filtres relationnels
		categoryId: textFilterSchema.optional(),
		supplierId: textFilterSchema.optional(),

		// Filtres textuels simples
		name: textFilterSchema.optional(),
		reference: textFilterSchema.optional(),

		// Filtres numériques
		price: numericFilterSchema.optional(),
	})
	.passthrough(); // Permet d'autres propriétés
