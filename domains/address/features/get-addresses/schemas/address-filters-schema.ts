import { AddressType } from "@prisma/client";
import { z } from "zod";

export const addressFiltersSchema = z.object({
	addressType: z.nativeEnum(AddressType).optional(),
});
