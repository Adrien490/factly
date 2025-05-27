import { sortOrderSchema } from "@/shared/schemas";
import { z } from "zod";
import {
	GET_CONTACTS_DEFAULT_SORT_BY,
	GET_CONTACTS_DEFAULT_SORT_ORDER,
} from "../constants";
import { contactFiltersSchema } from "./contact-filters-schema";
import { contactSortBySchema } from "./contact-sort-by-schema";

export const getContactsSchema = z.object({
	clientId: z.string().optional(),
	supplierId: z.string().optional(),
	search: z.string().optional(),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: contactSortBySchema.default(GET_CONTACTS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_CONTACTS_DEFAULT_SORT_ORDER),
	filters: contactFiltersSchema.optional().default({}),
});
