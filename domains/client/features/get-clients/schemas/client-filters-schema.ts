import { z } from "zod";
import { clientStatusSchema } from "./client-status-schema";
import { clientTypeSchema } from "./client-type-schema";

export const clientFiltersSchema = z.object({
	status: clientStatusSchema.optional(),
	type: clientTypeSchema.optional(),
});
