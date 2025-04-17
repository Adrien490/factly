import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_ADDRESSES_DEFAULT_SELECT } from "../constants";
import { getAddressesSchema } from "../schemas";

// Type simplifié sans pagination
export type GetAddressesReturn = Array<
	Prisma.AddressGetPayload<{ select: typeof GET_ADDRESSES_DEFAULT_SELECT }>
>;

export type GetAddressesParams = z.infer<typeof getAddressesSchema>;
