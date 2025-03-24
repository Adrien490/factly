import { SortOrderSchema } from "@/shared/schemas";
import { z } from "zod";

export const sortingSchema = <T extends [string, ...string[]]>(
	sortableFields: T
) => {
	return z.object({
		sortBy: z.enum(sortableFields).default(sortableFields[0]),
		sortOrder: SortOrderSchema,
	});
};
