import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_SUPPLIERS_DEFAULT_SELECT } from "../constants";
import { getSuppliersSchema } from "../schemas";

export type GetSuppliersReturn = {
	suppliers: Array<
		Prisma.SupplierGetPayload<{ select: typeof GET_SUPPLIERS_DEFAULT_SELECT }>
	>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

export type GetSuppliersParams = z.infer<typeof getSuppliersSchema>;
