import { z } from "zod";

/**
 * Schéma de pagination pour les clients
 * Optimisé pour ne gérer que les paramètres de pagination
 */
export const getClientsPaginationSchema = z.object({
	organizationId: z.string(),
	page: z.number().min(1).default(1),
	perPage: z.number().min(1).max(100).default(10),
});
