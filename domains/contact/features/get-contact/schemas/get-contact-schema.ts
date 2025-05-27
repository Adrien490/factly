import { z } from "zod";

export const getContactSchema = z.object({
	id: z.string().min(1, "L'ID du contact est requis"),
});
