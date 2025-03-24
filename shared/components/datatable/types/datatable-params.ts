import { PaginationParams } from "../../pagination/schemas";
import { SortingParams } from "../../sorting-dropdown/types";

export type DataTableParams<T extends [string, ...string[]]> =
	PaginationParams & SortingParams<T>;
