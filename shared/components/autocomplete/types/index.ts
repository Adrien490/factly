export interface AutocompleteProps<T> {
	name: string;
	value: string;
	onChange: (value: string) => void;
	onSelect: (item: T) => void;
	items: T[];
	getItemLabel: (item: T) => string;
	getItemDescription?: (item: T) => string | null;
	getItemImage?: (item: T) => { src: string; alt: string } | null;
	imageSize?: number;
	placeholder?: string;
	isLoading?: boolean;
	className?: string;
	inputClassName?: string;
	noResultsMessage?: string;
	minQueryLength?: number;
}
