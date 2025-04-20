import { z } from "zod";

export const loginWithSocialProviderSchema = z.object({
	provider: z.enum(["google", "github"]),
	callbackURL: z.string().optional(),
});
