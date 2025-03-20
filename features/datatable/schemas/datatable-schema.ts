import paginationSchema, {
	PaginationParams,
} from "@/features/pagination/schemas/pagination-schema";
import sortingSchema, {
	SortingParams,
} from "@/features/sorting/schemas/sorting-schema";
import { z } from "zod";

/**
 * Schéma complet pour les datatables combinant pagination et tri
 */
const datatableSchema = <T extends [string, ...string[]]>(
	sortableFields: T
) => {
	return z.object({
		...paginationSchema().shape,
		...sortingSchema(sortableFields).shape,
	});
};

// Type combinant pagination et tri pour les datatables
export type DataTableParams<T extends [string, ...string[]]> =
	PaginationParams & SortingParams<T>;

export default datatableSchema;
