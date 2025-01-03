"use server";

import { signIn } from "@/auth";

export default async function loginProvider({
	provider,
}: {
	provider: string;
}) {
	await signIn(provider, {
		redirectTo: "/dashboard",
		redirect: true,
	});
}
