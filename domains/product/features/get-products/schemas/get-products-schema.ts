import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_PRODUCTS_DEFAULT_SORT_BY,
	GET_PRODUCTS_DEFAULT_SORT_ORDER,
} from "../constants";
import { productFiltersSchema } from "./product-filters-schema";
import { productSortBySchema } from "./product-sort-by-schema";

export const getProductsSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: productFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: productSortBySchema.default(GET_PRODUCTS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_PRODUCTS_DEFAULT_SORT_ORDER),
});
