import { z } from "zod";

export const getAddressSchema = z.object({
	id: z.string(),
});
