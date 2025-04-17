import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_ADDRESS_DEFAULT_SELECT } from "../constants";
import { getAddressSchema } from "../schemas";

export type GetAddressParams = z.infer<typeof getAddressSchema>;
export type GetAddressReturn = Prisma.AddressGetPayload<{
	select: typeof GET_ADDRESS_DEFAULT_SELECT;
}>;
