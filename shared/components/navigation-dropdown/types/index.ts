export interface NavigationItem {
	label: string;
	href: string;
	icon?: React.ReactNode;
	isSeparatorBefore?: boolean;
}

export interface NavigationDropdownProps {
	items: NavigationItem[];
	className?: string;
	label?: string;
	icon?: React.ReactNode;
}
