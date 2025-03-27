import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../constants";
import { updateAddressSchema } from "../schemas";

// Types pour la mise à jour d'une adresse
export type UpdateAddressParams = z.infer<typeof updateAddressSchema>;
export type UpdateAddressReturn = Prisma.AddressGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;
