"use server";

import { signIn } from "@/auth";
import SendMagicLinkFormSchema from "@/app/(auth)/schemas/send-magic-link-form-schema";

type SendMagicLinkActionResponse = {
	success?: boolean;
	message?: string;
	inputs?: {
		email?: string;
	};
	errors?: {
		email?: string[];
	};
};

export default async function sendMagicLink(
	_: SendMagicLinkActionResponse | null,
	formData: FormData
) {
	const rawData = {
		email: formData.get("email") as string,
	};

	const validatedFields = SendMagicLinkFormSchema.safeParse(rawData);

	if (!validatedFields.success) {
		return {
			success: false,
			message: "Please fix the errors and try again.",
			errors: validatedFields.error.flatten().fieldErrors,
			inputs: rawData,
		};
	}

	return await signIn("resend", formData);
}
