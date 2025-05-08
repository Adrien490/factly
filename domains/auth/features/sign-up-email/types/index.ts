import { z } from "zod";
import { signUpEmailSchema } from "../schemas/sign-up-email-schema";

export type SignUpEmailSchema = z.infer<typeof signUpEmailSchema>;

export type SignUpEmailResponse = {
	message: string;
};
