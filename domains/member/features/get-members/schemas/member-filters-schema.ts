import { z } from "zod";

/**
 * Schéma de validation pour les filtres des membres
 */
export const memberFiltersSchema = z.object({
	emailVerified: z.boolean().optional(),
});

export type MemberFilters = z.infer<typeof memberFiltersSchema>;
