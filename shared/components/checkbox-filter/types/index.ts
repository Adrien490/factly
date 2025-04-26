export type FilterOption = {
	value: string;
	label: string;
	color?: string;
};

export interface CheckboxFilterProps {
	filterKey: string;
	id?: string;
	value: string;
	className?: string;
}
