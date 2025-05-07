import { z } from "zod";

export const signUpWithCredentialsSchema = z.object({
	email: z.string().email("Format d'email invalide"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.max(32, "Le mot de passe ne doit pas dépasser 32 caractères"),
	name: z.string().min(1, "Le nom est requis"),
	callbackURL: z.string().optional(),
});

export type SignUpWithCredentialsSchema = z.infer<
	typeof signUpWithCredentialsSchema
>;
