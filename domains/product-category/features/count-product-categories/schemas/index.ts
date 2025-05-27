import { z } from "zod";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes et booléens)
	z.string(),
	z.boolean(),
	z.null(), // Pour filtrer explicitement les valeurs null (ex: parentId: null)

	// Tableaux de valeurs
	z.array(z.string()),
]);

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const categoryFiltersSchema = z.record(filterValueSchema);

export const countProductCategoriesSchema = z.object({
	filters: categoryFiltersSchema.optional().default({}),
});
