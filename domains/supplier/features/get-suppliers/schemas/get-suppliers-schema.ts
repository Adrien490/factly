import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_SUPPLIERS_DEFAULT_SORT_BY,
	GET_SUPPLIERS_DEFAULT_SORT_ORDER,
	GET_SUPPLIERS_SORT_FIELDS,
} from "../constants";
import { supplierFiltersSchema } from "./supplier-filters-schema";

export const getSuppliersSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: supplierFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: z
		.preprocess((val) => {
			return typeof val === "string" &&
				GET_SUPPLIERS_SORT_FIELDS.includes(
					val as (typeof GET_SUPPLIERS_SORT_FIELDS)[number]
				)
				? val
				: GET_SUPPLIERS_DEFAULT_SORT_BY;
		}, z.enum(GET_SUPPLIERS_SORT_FIELDS))
		.default(GET_SUPPLIERS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_SUPPLIERS_DEFAULT_SORT_ORDER),
});
