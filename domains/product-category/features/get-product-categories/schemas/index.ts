import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";

// Schéma de tri
export const getProductCategoriesSortFieldSchema = z
	.enum(["name", "createdAt"])
	.default("name");

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
	filters: productCategoryFiltersSchema.optional().default({}),

	// ID du parent pour récupérer les sous-catégories
	// Si non fourni, récupère toutes les catégories
	// Si null, récupère uniquement les catégories racine
	parentId: z.string().nullable().optional(),

	// Indicateur pour récupérer uniquement les catégories racine
	rootOnly: z.boolean().optional().default(false),

	// Paramètres de pagination
	page: z.number().optional().default(1),
	perPage: z.number().optional().default(10),

	// Options de tri
	sortBy: getProductCategoriesSortFieldSchema.optional().default("name"),
	sortOrder: sortOrderSchema.optional().default("asc"),

	// Options pour les informations à inclure dans les résultats
	include: includeOptionsSchema.optional(),
});
