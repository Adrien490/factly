import { ReactNode } from "react";

export interface Feature {
	title: string;
	description: string;
	icon: ReactNode;
	benefits?: readonly string[];
	cta?: {
		label: string;
		href: string;
	};
}
