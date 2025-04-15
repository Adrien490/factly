import prisma from "@/shared/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";

// Vérification si nous sommes côté client ou serveur

// Récupération des variables d'environnement
const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	baseUrl: process.env.BETTER_AUTH_URL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	socialProviders: {
		...(googleClientId && googleClientSecret
			? {
					google: {
						clientId: googleClientId,
						clientSecret: googleClientSecret,
					},
			  }
			: {}),
	},
	plugins: [
		nextCookies(),
		passkey({
			// Configuration explicite pour localhost
			rpID: "localhost",
			rpName: "Factly",
			origin: process.env.BETTER_AUTH_URL,
			authenticatorSelection: {
				residentKey: "preferred",
				userVerification: "preferred",
			},
		}),
	],
	pages: {
		error: "/auth/error",
		signIn: "/login",
	},
});
