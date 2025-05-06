import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCT_DEFAULT_SELECT } from "../constants";
import { getProductSchema } from "../schemas";

export type GetProductReturn = Prisma.ProductGetPayload<{
	select: typeof GET_PRODUCT_DEFAULT_SELECT;
}> | null;

export type GetProductParams = z.infer<typeof getProductSchema>;
