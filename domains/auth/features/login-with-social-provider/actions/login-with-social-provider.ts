"use server";

import { auth } from "@/domains/auth/lib";
import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types";
import { headers } from "next/headers";
import { ResponseState } from "../components/login-with-social-provider-form/types";
import { loginWithSocialProviderSchema } from "../schemas";
import { Provider } from "../types";

export async function loginWithSocialProvider(
	_: ActionState<ResponseState, typeof loginWithSocialProviderSchema> | null,
	formData: FormData
): Promise<ActionState<ResponseState, typeof loginWithSocialProviderSchema>> {
	try {
		console.log("🚀 loginWithSocialProvider: début");

		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (session?.user?.id) {
			console.log("⚠️ Utilisateur déjà connecté:", session.user.id);
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous êtes déjà connecté"
			);
		}

		const rawData = {
			provider: formData.get("provider") as Provider,
			callbackURL: (formData.get("callbackURL") as string) || "/dashboard",
		};
		console.log(
			"📝 Provider:",
			rawData.provider,
			"CallbackURL:",
			rawData.callbackURL
		);

		const validation = loginWithSocialProviderSchema.safeParse(rawData);

		if (!validation.success) {
			console.log("❌ Validation échec:", validation.error.flatten());
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Données invalides"
			);
		}

		const { provider, callbackURL } = validation.data;
		console.log(
			"🔄 Appel signInSocial avec provider:",
			provider,
			"et callbackURL:",
			callbackURL
		);

		try {
			const response = await auth.api.signInSocial({
				body: {
					provider,
					callbackURL,
				},
			});

			if (!response) {
				console.error("❌ Réponse signInSocial vide");
				return createErrorResponse(
					ActionStatus.ERROR,
					"Aucune réponse du service d'authentification"
				);
			}

			console.log(
				"✅ Réponse signInSocial:",
				JSON.stringify(response, null, 2)
			);

			return createSuccessResponse(response, "Connexion réussie");
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Une erreur est survenue lors de la connexion";

			console.error("❌ Erreur signInSocial:", error);
			return createErrorResponse(ActionStatus.ERROR, errorMessage);
		}
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Une erreur inattendue est survenue";

		console.error("❌ Erreur globale:", error);
		return createErrorResponse(ActionStatus.ERROR, errorMessage);
	}
}
