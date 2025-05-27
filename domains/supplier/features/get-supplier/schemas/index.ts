import { z } from "zod";

export const getSupplierSchema = z.object({
	id: z.string(),
});
