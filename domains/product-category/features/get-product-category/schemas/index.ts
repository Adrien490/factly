import { z } from "zod";

// Schéma principal pour get-product-category
export const getProductCategorySchema = z
	.object({
		// Paramètre requis - l'organisation à laquelle appartiennent les catégories
		organizationId: z.string(),

		// Identifiant de la catégorie à récupérer
		id: z.string().optional(),

		// Alternative: slug de la catégorie à récupérer
		slug: z.string().optional(),
	})
	.refine((data) => data.id || data.slug, {
		message: "Vous devez fournir soit id soit slug",
	});
