import { HTMLAttributes } from "react";

export type DotsLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type DotsLoaderColor =
	| "default"
	| "primary"
	| "secondary"
	| "foreground"
	| "muted"
	| "accent"
	| "success"
	| "warning"
	| "destructive"
	| "white";

export interface DotsLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: DotsLoaderSize;
	color?: DotsLoaderColor;
	className?: string;
}
