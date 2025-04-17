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
	toggleSortOrder: (field: string) => void;
	resetSort: () => void;
	sortFields: SortField[];
	currentField?: SortField;
}
