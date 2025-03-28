import { z } from "zod";

export const SendMagicLinkFormSchema = z.object({
	email: z.string().email("Invalid email address"),
});
