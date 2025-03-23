import paginationSchema, {
	PaginationParams,
} from "@/shared/components/pagination/schemas/pagination-schema";

import { z } from "zod";
import sortingSchema, {
	SortingParams,
} from "../../sorting-dropdown/schemas/sorting-schema";

/**
 * Schéma complet pour les datatables combinant pagination et tri
 */
export const datatableSchema = <T extends [string, ...string[]]>(
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
