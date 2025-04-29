import { z } from "zod";

export const deleteMultipleSuppliersSchema = z.object({
	ids: z.array(z.string()).min(1, "Sélectionnez au moins un fournisseur"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
