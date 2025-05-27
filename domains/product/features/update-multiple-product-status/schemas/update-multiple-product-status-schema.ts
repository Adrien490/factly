import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const updateMultipleProductStatusSchema = z.object({
	ids: z.array(z.string()),
	status: z.nativeEnum(ProductStatus),
});
