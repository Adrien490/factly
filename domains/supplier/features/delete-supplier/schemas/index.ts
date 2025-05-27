import { z } from "zod";

export const deleteSupplierSchema = z.object({
	id: z.string().min(1, "L'ID du fournisseur est requis"),
});
