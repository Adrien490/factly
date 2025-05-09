import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface FormCardProps {
	title: string;
	description: string;
	icon: LucideIcon;
	children: ReactNode;
	className?: string;
}
