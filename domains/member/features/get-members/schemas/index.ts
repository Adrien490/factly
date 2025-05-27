import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_MEMBERS_DEFAULT_SORT_BY,
	GET_MEMBERS_DEFAULT_SORT_ORDER,
} from "../constants";
import { memberFiltersSchema } from "./member-filters-schema";
import { memberSortBySchema } from "./member-sort-by-schema";

export const getMembersSchema = z.object({
	search: z.string().optional(),
	filters: memberFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: memberSortBySchema.default(GET_MEMBERS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_MEMBERS_DEFAULT_SORT_ORDER),
});

export * from "./member-filters-schema";
export * from "./member-sort-by-schema";
