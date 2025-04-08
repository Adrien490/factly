import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
	className?: string;
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
	children?: React.ReactNode;
	illustration?: React.ReactNode;
}
