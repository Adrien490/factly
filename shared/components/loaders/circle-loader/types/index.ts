import { HTMLAttributes } from "react";

export type CircleLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type CircleLoaderColor =
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

export interface CircleLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: CircleLoaderSize;
	color?: CircleLoaderColor;
	className?: string;
}
