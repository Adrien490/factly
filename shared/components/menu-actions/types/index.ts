export interface MenuActionsProps {
	actions: MenuAction[];
	triggerClassName?: string;
	contentClassName?: string;
	align?: "start" | "end" | "center";
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
}

export interface MenuAction {
	id?: string;
	label: string;
	onClick?: () => void | Promise<void>;
	href?: string;
	className?: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	variant?: "destructive" | "default";
	divider?: boolean;
}
