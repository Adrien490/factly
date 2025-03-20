import { TagType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour les paramètres de comptage des tags
 */
const CountTagsSchema = z.object({
	organizationId: z.string({
		required_error: "L'ID de l'organisation est requis",
	}),
	search: z.string().optional(),
	type: z.nativeEnum(TagType).optional(),
});

export default CountTagsSchema;
export type CountTagsParams = z.infer<typeof CountTagsSchema>;
