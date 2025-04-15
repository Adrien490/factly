import { HTMLAttributes } from "react";

export type SpinnerLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerLoaderColor =
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

export interface SpinnerLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: SpinnerLoaderSize;
	color?: SpinnerLoaderColor;
	className?: string;
}
