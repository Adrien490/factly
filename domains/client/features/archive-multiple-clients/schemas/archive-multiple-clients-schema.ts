import { z } from "zod";

export const archiveMultipleClientsSchema = z.object({
	organizationId: z.string(),
	ids: z.array(z.string()),
});
