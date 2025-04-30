import { z } from "zod";

export const archiveMultipleSuppliersSchema = z.object({
	ids: z.array(z.string().min(1, "L'ID du fournisseur est requis")),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
