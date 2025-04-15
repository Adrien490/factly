import { z } from "zod";

export const signInWithProviderSchema = z.object({
	provider: z.enum(["google", "github"]),
	redirectUrl: z.string().optional(),
});
