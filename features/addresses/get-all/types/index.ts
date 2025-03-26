import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../constants";
import { getAddressesSchema } from "../schemas";

export type GetAddressesParams = z.infer<typeof getAddressesSchema>;
export type GetAddressesReturn = Array<
	Prisma.AddressGetPayload<{ select: typeof DEFAULT_SELECT }>
>;
