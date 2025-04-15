import { authClient } from "@/domains/auth/lib/auth-client";

export async function signIn(provider: "google" | "github") {
	await authClient.signIn.social({
		provider,
		callbackURL: "/dashboard",
	});
}
