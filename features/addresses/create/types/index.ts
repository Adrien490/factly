import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../constants";
import { createAddressSchema } from "../schemas";

export type CreateAddressParams = z.infer<typeof createAddressSchema>;
export type CreateAddressReturn = Prisma.AddressGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;
