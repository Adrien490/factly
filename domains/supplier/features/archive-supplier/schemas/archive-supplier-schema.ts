import { z } from "zod";

export const archiveSupplierSchema = z.object({
	id: z.string().uuid(),
	organizationId: z.string().uuid(),
});
