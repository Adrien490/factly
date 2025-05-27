import { z } from "zod";

export const archiveMultipleClientsSchema = z.object({
	ids: z.array(z.string()),
});
