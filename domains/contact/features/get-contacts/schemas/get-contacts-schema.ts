import { z } from "zod";
import { contactFiltersSchema } from "./contact-filters-schema";
import { contactSortBySchema } from "./contact-sort-by-schema";

export const getContactsSchema = z.object({
	clientId: z.string().optional(),
	supplierId: z.string().optional(),
	organizationId: z
		.string()
		.min(1, "L'identifiant de l'organisation est requis"),
	search: z.string().optional(),
	sortBy: contactSortBySchema.optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	filters: contactFiltersSchema.optional(),
});
