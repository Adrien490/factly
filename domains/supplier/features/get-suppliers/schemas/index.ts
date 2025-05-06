import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_SUPPLIERS_DEFAULT_SORT_BY,
	GET_SUPPLIERS_DEFAULT_SORT_ORDER,
} from "../constants";
import { supplierFiltersSchema } from "./supplier-filters-schema";
import { supplierSortBySchema } from "./supplier-sort-by-schema";

export const getSuppliersSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: supplierFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: supplierSortBySchema.default(GET_SUPPLIERS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_SUPPLIERS_DEFAULT_SORT_ORDER),
});
