import { z } from "zod";

/**
 * Schéma de validation pour l'archivage d'un client
 */
export const archiveClientSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du client est requis"),
});
