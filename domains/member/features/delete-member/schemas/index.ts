import { z } from "zod";

export const deleteMemberSchema = z.object({
	id: z.string().min(1),
});
