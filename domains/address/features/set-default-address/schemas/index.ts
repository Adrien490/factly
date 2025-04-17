import { z } from "zod";

export const setDefaultAddressSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
});
