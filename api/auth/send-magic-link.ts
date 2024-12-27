"use server";

import { signIn } from "@/auth";
import SendMagicLinkFormSchema, {
	SendMagicLinkActionResponse,
} from "@/lib/schemas/send-magic-link-form-schema";

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
