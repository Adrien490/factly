import { authClient } from "@/domains/auth";

export async function signIn(provider: "google" | "github") {
	await authClient.signIn.social({
		provider,
		callbackURL: "/dashboard",
	});
}
