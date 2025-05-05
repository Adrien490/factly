import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import {
	getProductCategoriesSchema,
	getProductCategoriesSortFieldSchema,
} from "../schemas";

// Type pour les catégories de produits
export type ProductCategory = Prisma.ProductCategoryGetPayload<{
	select: typeof GET_PRODUCT_CATEGORIES_DEFAULT_SELECT;
}> & {
	childCount?: number;
	hasChildren?: boolean;
};

// Type de retour
export type GetProductCategoriesReturn = {
	categories: ProductCategory[];
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

export type GetProductCategorySortField = z.infer<
	typeof getProductCategoriesSortFieldSchema
>;
