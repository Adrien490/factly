import { z } from "zod";

export const deleteProductSchema = z.object({
	id: z.string().min(1, "L'ID du produit est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
