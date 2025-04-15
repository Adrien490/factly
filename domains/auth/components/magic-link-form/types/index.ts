import { z } from "zod";
import { sendMagicLinkSchema } from "../schemas";

export type SendMagicLinkFormSchemaType = z.infer<typeof sendMagicLinkSchema>;
