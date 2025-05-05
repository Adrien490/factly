import { z } from "zod";

/**
 * Schéma pour la récupération des ancêtres d'une catégorie de produit
 */
export const getProductCategoryAncestorsSchema = z
	.object({
		// Paramètre requis - l'organisation à laquelle appartiennent les catégories
		organizationId: z.string(),

		// Identifiant de la catégorie pour laquelle récupérer les ancêtres
		categoryId: z.string().optional(),

		// Alternative: slug de la catégorie
		slug: z.string().optional(),

		// Nombre maximum d'ancêtres à récupérer (pour éviter les boucles infinies)
		maxDepth: z.number().int().positive().optional().default(10),
	})
	.refine((data) => data.categoryId || data.slug, {
		message: "Vous devez fournir soit categoryId soit slug",
	});
