import { ReactNode } from "react";

interface Feature {
	title: string;
	description: string;
	icon: ReactNode;
	benefits?: readonly string[];
	cta?: {
		label: string;
		href: string;
	};
}

export default Feature;
