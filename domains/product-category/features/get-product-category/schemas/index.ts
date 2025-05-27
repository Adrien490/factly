import { z } from "zod";

// Schéma principal pour get-product-category
export const getProductCategorySchema = z.object({
	id: z.string().optional(),
});
