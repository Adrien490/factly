import { HTMLAttributes } from "react";

export type ProgressLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ProgressLoaderColor =
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

export interface ProgressLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: ProgressLoaderSize;
	color?: ProgressLoaderColor;
	className?: string;
}
