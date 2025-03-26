import { authClient } from "@/features/auth/lib/auth-client";
import Provider from "@/features/auth/types/provider";

export const signIn = async (provider: Provider) => {
	await authClient.signIn.social({
		provider,
		callbackURL: "/dashboard",
	});
};

export function getUserInitials(
	nom: string | null | undefined,
	email: string | null | undefined
): string {
	if (nom) {
		return nom
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}
	return email?.substring(0, 2).toUpperCase() || "??";
}
