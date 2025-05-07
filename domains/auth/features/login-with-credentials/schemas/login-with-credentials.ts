import { z } from "zod";

export const loginWithCredentialsSchema = z.object({
	email: z.string().email("Format d'email invalide"),
	password: z.string().min(1, "Le mot de passe est requis"),
	callbackURL: z.string(),
});

export type LoginWithCredentialsSchema = z.infer<
	typeof loginWithCredentialsSchema
>;
