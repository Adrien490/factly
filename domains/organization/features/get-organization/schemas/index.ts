import { z } from "zod";

/**
 * Schéma de validation pour la récupération d'une organisation
 */
export const getOrganizationSchema = z
	.object({
		id: z.string().optional(),
		slug: z.string().optional(),
	})
	.refine((data) => data.id || data.slug, {
		message: "L'ID ou le slug de l'organisation est requis",
	});
