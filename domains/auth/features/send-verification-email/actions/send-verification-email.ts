"use server";

import { VerificationEmailTemplate } from "@/domains/auth/features/send-verification-email/components/verification-email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(data: {
	to: string;
	subject: string;
	url: string;
}) {
	try {
		const { data: emailData, error } = await resend.emails.send({
			from: "Factly <noreply@factly.fr>",
			to: [data.to],
			subject: data.subject,
			react: VerificationEmailTemplate({ url: data.url, userEmail: data.to }),
		});

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}
		return emailData;
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Une erreur est survenue lors de l'envoi de l'email";

		return { success: false, error: errorMessage };
	}
}
