import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_CLIENTS_DEFAULT_SORT_BY,
	GET_CLIENTS_DEFAULT_SORT_ORDER,
} from "../constants";
import { clientFiltersSchema } from "./client-filters-schema";
import { clientSortBySchema } from "./client-sort-by-schema";

export const getClientsSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: clientFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: clientSortBySchema.default(GET_CLIENTS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_CLIENTS_DEFAULT_SORT_ORDER),
});
