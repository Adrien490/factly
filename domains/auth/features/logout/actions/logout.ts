"use server";

import { auth } from "@/domains/auth/lib";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
	await auth.api.signOut({ headers: await headers() });
	redirect("/login");
}
