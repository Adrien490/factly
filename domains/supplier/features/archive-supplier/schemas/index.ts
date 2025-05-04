import { z } from "zod";

/**
 * Schéma de validation pour l'archivage d'un fournisseur
 */
export const archiveSupplierSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du fournisseur est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
