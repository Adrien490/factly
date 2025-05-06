import { z } from "zod";

export const archiveMultipleProductsSchema = z.object({
	organizationId: z.string(),
	ids: z.array(z.string()),
});
