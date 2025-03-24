import { z } from "zod";
import { paginationSchema } from "../../pagination/schemas";
import { sortingSchema } from "../../sorting-dropdown/schemas";

export const datatableSchema = <T extends [string, ...string[]]>(
	sortableFields: T
) => {
	return z.object({
		...paginationSchema().shape,
		...sortingSchema(sortableFields).shape,
	});
};
