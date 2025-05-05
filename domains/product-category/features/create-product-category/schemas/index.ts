import { z } from "zod";

/**
 * Schéma de validation pour le formulaire de catégorie de produit
 * Basé sur le modèle Prisma ProductCategory
 */
export const createProductCategorySchema = z.object({
	// Identifiants
	organizationId: z.string().min(1, "L'organisation est requise"),

	// Informations de base
	name: z.string().min(1, "Le nom est requis"),
	description: z.string().optional(),

	// Hiérarchie
	parentId: z.string().optional().nullable(),
});
