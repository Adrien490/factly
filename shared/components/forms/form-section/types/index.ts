import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface FormSectionProps {
	title: string;
	description: string;
	icon: LucideIcon;
	children: ReactNode;
	className?: string;
}
