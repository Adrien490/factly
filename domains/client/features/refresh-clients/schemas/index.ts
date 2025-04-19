import { z } from "zod";

export const refreshClientsSchema = z.object({
	organizationId: z.string(),
});
