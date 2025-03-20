import { TagType } from "@prisma/client";
import { z } from "zod";

const EditTagSchema = z.object({
	// ID du tag (obligatoire pour l'édition)
	id: z.string({
		required_error: "L'ID du tag est requis",
	}),

	// Informations de base
	name: z.string({
		required_error: "Le nom du tag est requis",
	}),
	type: z.nativeEnum(TagType, {
		required_error: "Le type de tag est requis",
	}),
	color: z.string().optional().nullable(),
	description: z.string().optional().nullable(),

	// Relation avec l'organisation
	organizationId: z.string({
		required_error: "L'ID de l'organisation est requis",
	}),
});

export default EditTagSchema;
export type EditTagData = z.infer<typeof EditTagSchema>;
