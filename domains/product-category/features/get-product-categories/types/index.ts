import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import { getProductCategoriesSchema } from "../schemas";

// Type pour les catégories de produits
export type ProductCategory = Prisma.ProductCategoryGetPayload<{
	select: typeof GET_PRODUCT_CATEGORIES_DEFAULT_SELECT;
}>;

// Type simplifié retournant directement un tableau de catégories enrichies
export type GetProductCategoriesReturn = Array<
	ProductCategory & {
		childCount?: number;
		hasChildren?: boolean;
		productCount?: number;
	}
>;

export type GetProductCategoriesParams = z.infer<
	typeof getProductCategoriesSchema
>;
