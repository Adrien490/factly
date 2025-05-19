import { z } from "zod";

export const deleteOrganizationSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
});
