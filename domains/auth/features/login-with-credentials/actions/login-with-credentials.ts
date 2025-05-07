"use server";

import { auth } from "@/domains/auth/lib";
import {
	ActionStatus,
	createErrorResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginWithCredentialsSchema } from "../schemas/login-with-credentials";

export const loginWithCredentials: ServerAction<
	null,
	typeof loginWithCredentialsSchema
> = async (_, formData) => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous êtes déjà connecté"
			);
		}

		const rawData = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			callbackURL: formData.get("callbackURL") as string,
		};

		const validation = loginWithCredentialsSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const { email, password, callbackURL } = validation.data;

		try {
			const response = await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL,
				},
			});

			if (!response) {
				return createErrorResponse(
					ActionStatus.ERROR,
					"Aucune réponse du service d'authentification"
				);
			}

			// La redirection va lancer une erreur NEXT_REDIRECT, c'est normal
			redirect(callbackURL);
		} catch (error) {
			// Vérifier si l'erreur est liée à une redirection Next.js

			const errorMessage =
				error instanceof Error
					? error.message
					: "Une erreur est survenue lors de la connexion";

			return createErrorResponse(ActionStatus.ERROR, errorMessage);
		}
	} catch (error) {
		// Vérifier si l'erreur est liée à une redirection Next.js

		const errorMessage =
			error instanceof Error
				? error.message
				: "Une erreur inattendue est survenue";

		return createErrorResponse(ActionStatus.ERROR, errorMessage);
	}
};
