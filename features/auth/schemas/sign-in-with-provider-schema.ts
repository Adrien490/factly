import { z } from "zod";

const signInWithProviderSchema = z.object({
	provider: z.enum(["google", "github"]),
	redirectUrl: z.string().optional(),
});

export type SignInWithProviderSchemaType = z.infer<
	typeof signInWithProviderSchema
>;

export default signInWithProviderSchema;
