import { z } from "zod";
import { setDefaultContactSchema } from "../schemas/set-default-contact-schema";

export type SetDefaultContactInput = z.infer<typeof setDefaultContactSchema>;
