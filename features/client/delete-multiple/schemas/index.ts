import { z } from "zod";

export const deleteMultipleClientsSchema = z.object({
	ids: z.array(z.string().min(1, "L'ID du client est requis")),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
