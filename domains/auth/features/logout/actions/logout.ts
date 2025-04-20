"use server";

import { auth } from "@/domains/auth/lib";
import { ActionStatus, createErrorResponse } from "@/shared/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return createErrorResponse(
			ActionStatus.UNAUTHORIZED,
			"Vous n'êtes pas connecté"
		);
	}

	await auth.api.signOut({ headers: await headers() });
	redirect("/login");
}
