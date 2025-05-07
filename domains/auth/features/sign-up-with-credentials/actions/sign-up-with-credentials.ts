"use server";

import { auth } from "@/domains/auth/lib";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types";
import { headers } from "next/headers";
import { signUpWithCredentialsSchema } from "../schemas/sign-up-with-credentials";

export const signUpWithCredentials: ServerAction<
	null,
	typeof signUpWithCredentialsSchema
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
			name: formData.get("name") as string,
		};

		const validation = signUpWithCredentialsSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const { email, password, name } = validation.data;

		try {
			const response = await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
				},
			});

			if (!response) {
				return createErrorResponse(
					ActionStatus.ERROR,
					"Une erreur est survenue lors de l'inscription"
				);
			}

			return createSuccessResponse(null, "Inscription réussie");
		} catch (error) {
			// Vérifier si l'erreur est liée à une redirection Next.js

			const errorMessage =
				error instanceof Error
					? error.message
					: "Une erreur est survenue lors de l'inscription";

			return createErrorResponse(ActionStatus.ERROR, errorMessage);
		}
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Une erreur inattendue est survenue";

		return createErrorResponse(ActionStatus.ERROR, errorMessage);
	}
};
