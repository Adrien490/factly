import { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface SortField {
	label: string;
	value: string;
	icon?: ReactNode;
}

export interface SortingOptionsState {
	currentSortBy: string;
	currentSortOrder: SortDirection;
	isPending: boolean;
	updateSort: (field: string, order: SortDirection) => void;
	sortFields: SortField[];
	currentField?: SortField;
}
