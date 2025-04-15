import { ButtonHTMLAttributes } from "react";

export interface ScrollToButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	targetId: string;
	label: string;
	iconClassName?: string;
	behavior?: ScrollBehavior;
	icon?: React.ReactNode;
}
