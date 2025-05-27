import { z } from "zod";

export const archiveMultipleSuppliersSchema = z.object({
	ids: z.array(z.string()),
});
