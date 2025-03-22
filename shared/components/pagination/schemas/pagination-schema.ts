import { z } from "zod";

/**
 * Schéma de pagination générique
 * Utilisé pour standardiser les paramètres de pagination dans l'application
 */
const paginationSchema = () => {
	return z.object({
		page: z.number().min(1).default(1),
		perPage: z.number().min(1).max(100).default(10),
	});
};

export type PaginationParams = z.infer<ReturnType<typeof paginationSchema>>;

export default paginationSchema;
