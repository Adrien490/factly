import { z } from "zod";

export const deleteMultipleSuppliersSchema = z.object({
	ids: z.array(z.string()),
});
