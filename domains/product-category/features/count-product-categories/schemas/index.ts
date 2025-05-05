import { z } from "zod";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes et booléens)
	z.string(),
	z.boolean(),
	z.null(), // Pour filtrer explicitement les valeurs null (ex: parentId: null)

	// Tableaux de valeurs
	z.array(z.string()),
]);

// Options spécifiques à la hiérarchie des catégories
const hierarchyOptionsSchema = z
	.object({
		// Inclure uniquement les catégories de premier niveau (sans parent)
		rootCategoriesOnly: z.boolean().optional().default(false),

		// Inclure uniquement les catégories qui ont des enfants
		withChildrenOnly: z.boolean().optional().default(false),

		// Inclure uniquement les catégories qui n'ont pas d'enfants (feuilles de l'arbre)
		leafCategoriesOnly: z.boolean().optional().default(false),

		// Inclure les descendants d'une catégorie spécifique
		parentId: z.string().nullable().optional(),
	})
	.optional()
	.default({});

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const categoryFiltersSchema = z.record(filterValueSchema);

export const countProductCategoriesSchema = z.object({
	organizationId: z.string(),
	filters: categoryFiltersSchema.optional().default({}),
	hierarchy: hierarchyOptionsSchema,
});
