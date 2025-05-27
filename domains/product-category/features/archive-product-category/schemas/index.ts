import { z } from "zod";

/**
 * Schéma de validation pour l'archivage d'une catégorie de produit
 */
export const archiveProductCategorySchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID de la catégorie est requis"),
});
