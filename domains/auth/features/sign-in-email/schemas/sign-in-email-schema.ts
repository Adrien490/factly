import { z } from "zod";

export const signInEmailSchema = z.object({
	email: z.string().email("Format d'email invalide"),
	password: z.string().min(1, "Le mot de passe est requis"),
	callbackURL: z.string(),
});
