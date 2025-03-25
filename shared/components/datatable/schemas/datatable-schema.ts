import { z } from "zod";
import { sortingSchema } from "../../sorting-dropdown/schemas";
import { paginationSchema } from "../components/pagination/schemas";

export const datatableSchema = <T extends [string, ...string[]]>(
	sortableFields: T
) => {
	return z.object({
		...paginationSchema().shape,
		...sortingSchema(sortableFields).shape,
	});
};
