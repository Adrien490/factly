import { z } from "zod";

const DeleteTagSchema = z.object({
	id: z.string({
		required_error: "L'ID du tag est requis",
	}),
	organizationId: z.string({
		required_error: "L'ID de l'organisation est requis",
	}),
});

export default DeleteTagSchema;
export type DeleteTagFormData = z.infer<typeof DeleteTagSchema>;
