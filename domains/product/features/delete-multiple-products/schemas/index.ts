import { z } from "zod";

export const deleteMultipleProductsSchema = z.object({
	ids: z.array(z.string()).min(1, "Sélectionnez au moins un produit"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
