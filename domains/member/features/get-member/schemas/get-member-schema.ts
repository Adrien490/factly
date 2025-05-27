import { z } from "zod";

export const getMemberSchema = z.object({
	id: z.string().min(1, "L'ID est requis"),
});
