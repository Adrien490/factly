import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export const authConfig: NextAuthConfig = {
	providers: [
		Google,
		Github,
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: process.env.AUTH_RESEND_FROM,
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
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.picture = user.image;
			}
			return token;
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
