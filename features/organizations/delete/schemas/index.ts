import { z } from "zod";

export const deleteOrganizationSchema = z.object({
	id: z.string().min(1, "L'ID de l'organisation est requis"),
});
