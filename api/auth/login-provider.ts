"use server";

import { signIn } from "@/auth";
import { z } from "zod";

const LoginProviderSchema = z.object({
	provider: z.enum(["google", "github"]),
});

export default async function loginProvider({
	provider,
}: {
	provider: string;
}) {
	const validatedFields = LoginProviderSchema.safeParse({
		provider,
	});

	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid provider",
		};
	}

	await signIn(provider, {
		redirectTo: "/dashboard",
	});
}
