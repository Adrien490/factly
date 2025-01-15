import { z } from "zod";

const providerSchema = z.enum(["google", "github"]);

export type ProviderSchemaType = z.infer<typeof providerSchema>;

export default providerSchema;
