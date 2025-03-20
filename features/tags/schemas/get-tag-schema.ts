import { z } from "zod";

const GetTagSchema = z.object({
	id: z.string({
		required_error: "L'ID du tag est requis",
	}),
	organizationId: z.string({
		required_error: "L'ID de l'organisation est requis",
	}),
});

export type GetTagParams = z.infer<typeof GetTagSchema>;
export default GetTagSchema;
