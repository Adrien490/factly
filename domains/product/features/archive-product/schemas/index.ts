import { z } from "zod";

/**
 * Schéma de validation pour l'archivage d'un produit
 */
export const archiveProductSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du produit est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
