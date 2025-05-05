import { z } from "zod";

// Schéma de tri
export const sortFieldSchema = z.enum([
	"name",
	"createdAt",
	"updatedAt",
	"status",
]);
export const sortOrderSchema = z.enum(["asc", "desc"]);

// Schéma pour les filtres de catégories
const filterValueSchema = z.union([
	// Valeurs uniques (chaînes et booléens)
	z.string(),
	z.boolean(),

	// Tableaux de valeurs
	z.array(z.string()),
]);

// Le schéma pour les filtres de catégories
export const productCategoryFiltersSchema = z.record(filterValueSchema);

// Schéma pour spécifier les options d'inclusion
export const includeOptionsSchema = z
	.object({
		// Inclure le nombre d'enfants pour chaque catégorie
		childCount: z.boolean().optional().default(true),
		// Inclure les données du parent (pour navigation et breadcrumbs)
		parent: z.boolean().optional().default(false),
	})
	.optional()
	.default({});

// Schéma principal pour get-product-categories
export const getProductCategoriesSchema = z.object({
	// Paramètre requis - l'organisation à laquelle appartiennent les catégories
	organizationId: z.string(),

	// Paramètres de recherche et filtrage
	search: z.string().optional(),
	filters: productCategoryFiltersSchema.default({}),

	// Navigation par dossier - paramètre principal
	// null = niveau racine
	// string = ID du dossier actuel
	// undefined = tous les niveaux (mode liste plate)
	parentId: z.string().nullable().optional(),

	// Options de tri
	sortBy: sortFieldSchema.default("name"),
	sortOrder: sortOrderSchema.default("asc"),

	// Options pour les informations à inclure dans les résultats
	include: includeOptionsSchema.optional(),
});
