import { z } from "zod";

export const sendMagicLinkSchema = z.object({
	email: z.string().email("Invalid email address"),
});
