import { ReactNode } from "react";

export interface MenuItem {
	label: string;
	href?: string;
	icon?: ReactNode;
	items?: MenuItem[];
}

export interface HorizontalMenuProps {
	items: MenuItem[];
	className?: string;
}
