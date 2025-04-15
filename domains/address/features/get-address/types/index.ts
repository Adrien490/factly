import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../../constants";
import { getAddressSchema } from "../schemas";

export type GetAddressParams = z.infer<typeof getAddressSchema>;
export type GetAddressReturn = Prisma.AddressGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;
