import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { getUserById } from "./api/user/get-user";

export const authConfig = {
	providers: [
		Google,
		Github,
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: "no-reply@resend.dev",
		}),
	],
	events: {
		async createUser({}) {},
	},
	callbacks: {
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
				session.user.name = token.name || "";
				session.user.email = token.email || "";
				session.user.image = token.picture;
			}
			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);
			if (!existingUser) return token;

			return {
				...token,
				id: existingUser.id,
				name: existingUser.name,
				email: existingUser.email,
				picture: existingUser.image,
			};
		},
	},
	pages: {
		signIn: "/login",
		error: "/error",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	jwt: {
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	trustHost: true,
} satisfies NextAuthConfig;
