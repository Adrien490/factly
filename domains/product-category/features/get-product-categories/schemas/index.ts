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

// Options pour récupérer les catégories dans une structure spécifique
export const structureOptionsSchema = z
	.object({
		// Si true, organise les catégories en arbre hiérarchique au lieu d'une liste plate
		asTree: z.boolean().default(false),

		// Si true, inclut le nombre de produits pour chaque catégorie
		includeProductCount: z.boolean().default(false),

		// Si true, inclut le nombre d'enfants directs pour chaque catégorie
		includeChildrenCount: z.boolean().default(false),

		// Profondeur maximale à récupérer pour la structure en arbre (si asTree est true)
		maxDepth: z.number().int().min(1).max(10).default(5),
	})
	.default({});

// Options de pagination
export const paginationOptionsSchema = z
	.object({
		page: z.number().int().min(1).default(1),
		perPage: z.number().int().min(1).max(100).default(50),
	})
	.default({});

// Schéma pour spécifier les relations à inclure
export const includeOptionsSchema = z
	.object({
		parent: z.boolean().default(false),
		children: z.boolean().default(false),
	})
	.default({});

// Schéma principal pour get-product-categories
export const getProductCategoriesSchema = z.object({
	// Paramètres requis
	organizationId: z.string(),

	// Paramètres optionnels de recherche et filtrage
	search: z.string().optional(),
	filters: productCategoryFiltersSchema.default({}),

	// Filtrage hiérarchique
	parentId: z.string().nullable().optional(),
	level: z.number().int().min(1).max(10).optional(),
	path: z.string().optional(), // Pour récupérer par chemin "parent/enfant/etc"
	slug: z.string().optional(), // Pour récupérer une catégorie spécifique par slug

	// Options de tri
	sortBy: sortFieldSchema.default("name"),
	sortOrder: sortOrderSchema.default("asc"),

	// Options de structure et relations
	structure: structureOptionsSchema,
	include: includeOptionsSchema,

	// Options de pagination
	pagination: paginationOptionsSchema,
});

// Types exportés pour une utilisation facile
export type GetProductCategoriesParams = z.infer<
	typeof getProductCategoriesSchema
>;
export type SortField = z.infer<typeof sortFieldSchema>;
export type SortOrder = z.infer<typeof sortOrderSchema>;
export type StructureOptions = z.infer<typeof structureOptionsSchema>;
export type PaginationOptions = z.infer<typeof paginationOptionsSchema>;
export type IncludeOptions = z.infer<typeof includeOptionsSchema>;
