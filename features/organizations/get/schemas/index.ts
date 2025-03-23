import { z } from "zod";

/**
 * Schéma de validation pour la récupération d'une organisation
 */
export const getOrganizationSchema = z.object({
	id: z.string().min(1, "L'ID de l'organisation est requis"),
});
