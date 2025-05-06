import { z } from "zod";

export const refreshProductsSchema = z.object({
	organizationId: z.string(),
});
