import prisma from "@/shared/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";
import { sendVerificationEmail } from "../features/send-verification-email/actions/send-verification-email";

// Vérification si nous sommes côté client ou serveur

// Récupération des variables d'environnement
const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthUrl = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
	emailVerification: {
		requireEmailVerification: true,
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendVerificationEmail({
				to: user.email,
				subject: "Verify your email address",
				url,
			});
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	secret: betterAuthSecret,
	baseUrl: betterAuthUrl,
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
	plugins: [nextCookies(), passkey()],
	pages: {
		error: "/auth/error",
		signIn: "/signin",
	},
});
