import { z } from "zod";

export const checkReferenceSchema = z.object({
	reference: z.string().min(1),
});
