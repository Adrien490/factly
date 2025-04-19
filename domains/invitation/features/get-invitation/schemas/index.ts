import { z } from "zod";

export const getInvitationSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
});
