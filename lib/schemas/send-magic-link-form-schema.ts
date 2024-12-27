import { z } from "zod";

export const SendMagicLinkFormSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export type SendMagicLinkActionResponse = {
	success?: boolean;
	message?: string;
	inputs?: {
		email?: string;
	};
	errors?: {
		email?: string[];
	};
};
export type SendMagicLinkFormSchemaType = z.infer<
	typeof SendMagicLinkFormSchema
>;

export default SendMagicLinkFormSchema;
