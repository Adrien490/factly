import { z } from "zod";

export const SendMagicLinkFormSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export type SendMagicLinkFormSchemaType = z.infer<
	typeof SendMagicLinkFormSchema
>;

export default SendMagicLinkFormSchema;
