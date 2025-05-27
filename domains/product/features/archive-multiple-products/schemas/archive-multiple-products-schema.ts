import { z } from "zod";

export const archiveMultipleProductsSchema = z.object({
	ids: z.array(z.string()).min(1, "Au moins un produit doit être sélectionné"),
});
