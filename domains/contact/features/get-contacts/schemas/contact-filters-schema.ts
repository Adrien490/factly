import { Civility } from "@prisma/client";
import { z } from "zod";

export const contactFiltersSchema = z.object({
	civility: z
		.union([z.nativeEnum(Civility), z.array(z.nativeEnum(Civility))])
		.optional(),
	isDefault: z.boolean().optional(),
});
