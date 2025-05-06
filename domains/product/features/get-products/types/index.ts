import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCTS_DEFAULT_SELECT } from "../constants";
import { getProductsSchema } from "../schemas";

export type GetProductsReturn = {
	products: Array<
		Prisma.ProductGetPayload<{ select: typeof GET_PRODUCTS_DEFAULT_SELECT }>
	>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

export type GetProductsParams = z.infer<typeof getProductsSchema>;
