import { z } from "zod";

export const deleteContactSchema = z.object({
	id: z.string().min(1, "L'ID du contact est requis"),
});

export type DeleteContactInput = z.infer<typeof deleteContactSchema>;
