import { z } from "zod";

export const createMemberSchema = z.object({
	email: z
		.string()
		.min(1, "L'email est requis")
		.email("L'email doit être valide"),
});
