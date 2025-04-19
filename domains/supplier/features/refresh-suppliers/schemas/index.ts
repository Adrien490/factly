import { z } from "zod";

export const refreshSuppliersSchema = z.object({
	organizationId: z.string(),
});
