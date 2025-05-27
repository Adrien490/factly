import { z } from "zod";

export const getCompanySchema = z.object({
	id: z.string().min(1, "L'ID est requis").optional(),
});
