import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";

// Type pour les catégories de produits
type ProductCategory = Prisma.ProductCategoryGetPayload<{
	select: typeof GET_PRODUCT_CATEGORIES_DEFAULT_SELECT;
}>;

// Type incluant la pagination similaire à get-clients
export type GetProductCategoriesReturn = {
	categories: Array<ProductCategory>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

export type GetProductCategoriesParams = z.infer<
	typeof getProductCategoriesSchema
>;
