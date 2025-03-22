import SortOrderSchema from "@/shared/components/sorting/schemas/sort-order-schema";
import { z } from "zod";

const sortingSchema = <T extends [string, ...string[]]>(sortableFields: T) => {
	return z.object({
		sortBy: z.enum(sortableFields).default(sortableFields[0]),
		sortOrder: SortOrderSchema,
	});
};

export type SortingParams<T extends [string, ...string[]]> = z.infer<
	ReturnType<typeof sortingSchema<T>>
>;

export default sortingSchema;
