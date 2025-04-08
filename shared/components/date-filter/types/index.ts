export interface DateFilterProps {
	filterKey: string;
	label: string;
	placeholder?: string;
	format?: string;
	minDate?: Date;
	maxDate?: Date;
	className?: string;
	onDateChange?: (date: string) => void;
}
