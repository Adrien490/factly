import { Provider } from "@/domains/auth/features/login-with-social-provider/types";

// Cette fonction n'est plus utilisée directement, on passe par le hook useLoginWithSocialProvider
export async function signIn(
	provider: Provider,
	callbackURL: string = "/dashboard"
) {
	// Préparation des données pour le formulaire
	const formData = new FormData();
	formData.append("provider", provider);
	formData.append("callbackURL", callbackURL);

	return formData;
}
