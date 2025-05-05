import { ReactNode } from "react";

export interface MenuItem {
	title: string;
	url?: string;
	icon?: ReactNode;
	items?: MenuItem[];
}

export interface HorizontalMenuProps {
	items: MenuItem[];
	className?: string;
}
