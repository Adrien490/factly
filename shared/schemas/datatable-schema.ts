import { z } from "zod";
import { paginationSchema } from "../components/datatable/pagination/schemas";
import { sortingSchema } from "../components/sorting-dropdown/schemas";

export const datatableSchema = <T extends [string, ...string[]]>(
	sortableFields: T
) => {
	return z.object({
		...paginationSchema().shape,
		...sortingSchema(sortableFields).shape,
	});
};
