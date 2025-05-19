import { z } from "zod";

export const softDeleteOrganizationSchema = z.object({
	id: z.string(),
});
