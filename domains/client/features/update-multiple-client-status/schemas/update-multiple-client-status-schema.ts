import { ClientStatus } from "@prisma/client";
import { z } from "zod";

export const updateMultipleClientStatusSchema = z.object({
	organizationId: z.string(),
	ids: z.array(z.string()),
	status: z.nativeEnum(ClientStatus),
});
