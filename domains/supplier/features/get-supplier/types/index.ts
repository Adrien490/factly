import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_SUPPLIER_DEFAULT_SELECT } from "../constants";
import { getSupplierSchema } from "../schemas";

export type GetSupplierReturn = Prisma.SupplierGetPayload<{
	select: typeof GET_SUPPLIER_DEFAULT_SELECT;
}>;

export type GetSupplierParams = z.infer<typeof getSupplierSchema>;
