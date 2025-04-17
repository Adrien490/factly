import { Prisma } from "@prisma/client";
import { DEFAULT_SELECT } from "../../../constants";

export type SetDefaultAddressReturn = Prisma.AddressGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;
