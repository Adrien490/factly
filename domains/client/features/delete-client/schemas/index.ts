import { z } from "zod";

export const deleteClientSchema = z.object({
	id: z.string().min(1, "L'ID du client est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
