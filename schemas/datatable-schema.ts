import SortOrderSchema from "@/schemas/sort-order-schema";
import { z } from "zod";

const datatableSchema = <T extends [string, ...string[]]>(
	sortableFields: T
) => {
	return z.object({
		page: z.number().min(1).default(1),
		perPage: z.number().min(1).max(100).default(10),
		sortBy: z.enum(sortableFields).default(sortableFields[0]),
		sortOrder: SortOrderSchema,
		search: z.string().optional(),
		filters: z.record(z.any()).default({}),
	});
};

export type DataTableParams<T extends [string, ...string[]]> = z.infer<
	ReturnType<typeof datatableSchema<T>>
>;

export default datatableSchema;
