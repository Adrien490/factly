import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const updateMultipleProductStatusSchema = z.object({
	organizationId: z.string(),
	ids: z.array(z.string()),
	status: z.nativeEnum(ProductStatus),
});
