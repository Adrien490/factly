import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_PRODUCT_CATEGORIES_DEFAULT_SELECT } from "../constants";
import {
	getProductCategoriesFormatSchema,
	getProductCategoriesSchema,
	getProductCategoriesSortFieldSchema,
} from "../schemas";

// Type pour les catégories de produits
export type ProductCategory = Prisma.ProductCategoryGetPayload<{
	select: typeof GET_PRODUCT_CATEGORIES_DEFAULT_SELECT;
}>;

// Type pour une catégorie enrichie (format flat)
export type ProductCategoryFlat = ProductCategory & {
	childCount?: number;
	hasChildren?: boolean;
};

// Type pour une catégorie en format arborescence (format tree)
export type ProductCategoryTree = ProductCategoryFlat & {
	children?: ProductCategoryTree[];
};

// Type de retour en fonction du format demandé
export type GetProductCategoriesReturn =
	| ProductCategoryFlat[]
	| ProductCategoryTree[];

export type GetProductCategoriesParams = z.infer<
	typeof getProductCategoriesSchema
>;

export type GetProductCategorySortField = z.infer<
	typeof getProductCategoriesSortFieldSchema
>;

export type GetProductCategoriesFormat = z.infer<
	typeof getProductCategoriesFormatSchema
>;
