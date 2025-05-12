import { z } from "zod";

export const setDefaultContactSchema = z.object({
	id: z.string().min(1, "L'identifiant du contact est requis"),
	organizationId: z
		.string()
		.min(1, "L'identifiant de l'organisation est requis"),
	clientId: z.string().optional(),
	supplierId: z.string().optional(),
});
