import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";

export type GetProductCategoriesReturn = Array<
	Prisma.ProductCategoryGetPayload<{
		select: typeof GET_PRODUCT_CATEGORIES_DEFAULT_SELECT;
	}>
>;

export type GetProductCategoriesParams = z.infer<
	typeof getProductCategoriesSchema
>;
