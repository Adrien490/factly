import { z } from "zod";

export const archiveMultipleSuppliersSchema = z.object({
	organizationId: z.string(),
	ids: z.array(z.string()),
});
