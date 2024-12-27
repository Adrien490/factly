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
	const { provider: parsedProvider } = LoginProviderSchema.parse({
		provider,
	});

	await signIn(parsedProvider, { redirectTo: "/dashboard" });
}
