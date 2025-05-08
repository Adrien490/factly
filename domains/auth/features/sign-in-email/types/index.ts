import { z } from "zod";
import { signInEmailSchema } from "../schemas/sign-in-email-schema";

export type SignInEmailSchema = z.infer<typeof signInEmailSchema>;
