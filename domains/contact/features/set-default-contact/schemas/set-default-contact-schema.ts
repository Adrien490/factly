import { z } from "zod";

export const setDefaultContactSchema = z.object({
	id: z.string().min(1, "L'ID du contact est requis"),
	clientId: z.string().optional(),
	supplierId: z.string().optional(),
});
