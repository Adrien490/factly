import { z } from "zod";

// Schéma pour les filtres de catégories
const filterValueSchema = z.union([
	// Valeurs uniques (chaînes et booléens)
	z.string(),
	z.boolean(),

	// Tableaux de valeurs
	z.array(z.string()),
]);

// Le schéma pour les filtres de catégories
const productCategoryFiltersSchema = z.record(filterValueSchema);

// Schéma principal pour get-product-categories
export const getProductCategoriesSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: productCategoryFiltersSchema.default({}),
	parentId: z.string().nullable().optional(),
});
