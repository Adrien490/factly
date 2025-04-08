export type FilterOption = {
	value: string;
	label: string;
};

export interface FilterSelectProps {
	filterKey: string;
	label: string;
	options: FilterOption[];
	placeholder?: string;
	className?: string;
	maxHeight?: number;
}
