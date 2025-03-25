import { SortingParams } from "../../sorting-dropdown/types";
import { PaginationParams } from "../components/pagination/schemas";

export type DataTableParams<T extends [string, ...string[]]> =
	PaginationParams & SortingParams<T>;

export interface ColumnDef<T> {
	id: string;
	header: string | (() => React.ReactNode);
	cell: (item: T) => React.ReactNode;
	visibility?: "always" | "tablet" | "desktop";
	align?: "left" | "center" | "right";
	sortable?: boolean;
}
