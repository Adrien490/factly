import { z } from "zod";

export const refreshProductCategoriesSchema = z.object({
	organizationId: z.string(),
});
