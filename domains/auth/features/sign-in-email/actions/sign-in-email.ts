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
import { signInEmailSchema } from "../schemas/sign-in-email-schema";

export const signInEmail: ServerAction<null, typeof signInEmailSchema> = async (
	_,
	formData
) => {
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

		const validation = signInEmailSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				""
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

			redirect(callbackURL);
		} catch (error) {
			// Gestion spécifique des erreurs d'authentification
			if (error instanceof Error) {
				if (
					error.message.includes("Invalid email or password") ||
					error.message.includes("Invalid credentials")
				) {
					return createErrorResponse(
						ActionStatus.UNAUTHORIZED,
						"Email ou mot de passe incorrect"
					);
				}
				return createErrorResponse(ActionStatus.ERROR, error.message);
			}

			return createErrorResponse(
				ActionStatus.ERROR,
				"Une erreur est survenue lors de la connexion"
			);
		}
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Une erreur inattendue est survenue";

		return createErrorResponse(ActionStatus.ERROR, errorMessage);
	}
};
