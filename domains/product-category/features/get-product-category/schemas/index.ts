import { z } from "zod";

// Schéma principal pour get-product-category
export const getProductCategorySchema = z.object({
	organizationId: z.string(),

	id: z.string().optional(),
});
