export interface FilterContextType {
	// État
	values: string[];
	isEmpty: boolean;
	isPending: boolean;

	// Actions
	setFilter: (value: string | null) => void;
	setFilters: (values: string[]) => void;
	toggleFilter: (value: string) => void;
	clearFilter: () => void;

	// Helpers
	isSelected: (value: string) => boolean;
	hasValue: () => boolean;
}
