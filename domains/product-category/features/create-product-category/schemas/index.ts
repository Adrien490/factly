import { z } from "zod";

/**
 * Schéma de validation pour le formulaire de catégorie de produit
 * Basé sur le modèle Prisma ProductCategory
 */
export const createProductCategorySchema = z.object({
	// Informations de base
	name: z.string().min(1, "Le nom est requis"),
	description: z.string().optional(),
});
