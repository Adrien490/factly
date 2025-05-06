import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_CLIENTS_DEFAULT_SORT_BY,
	GET_CLIENTS_DEFAULT_SORT_ORDER,
	GET_CLIENTS_SORT_FIELDS,
} from "../constants";
import { clientFiltersSchema } from "./client-filters-schema";

export const getClientsSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: clientFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: z
		.preprocess((val) => {
			return typeof val === "string" &&
				GET_CLIENTS_SORT_FIELDS.includes(
					val as (typeof GET_CLIENTS_SORT_FIELDS)[number]
				)
				? val
				: GET_CLIENTS_DEFAULT_SORT_BY;
		}, z.enum(GET_CLIENTS_SORT_FIELDS))
		.default(GET_CLIENTS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_CLIENTS_DEFAULT_SORT_ORDER),
});
