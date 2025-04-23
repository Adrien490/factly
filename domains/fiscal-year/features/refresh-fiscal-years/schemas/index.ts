import { z } from "zod";

export const refreshFiscalYearsSchema = z.object({
	organizationId: z.string(),
});
