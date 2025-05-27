import { ClientStatus } from "@prisma/client";
import { z } from "zod";

export const updateMultipleClientStatusSchema = z.object({
	ids: z.array(z.string()),
	status: z.nativeEnum(ClientStatus),
});
