import { HTMLAttributes } from "react";

export type PulseLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type PulseLoaderColor =
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

export interface PulseLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: PulseLoaderSize;
	color?: PulseLoaderColor;
	className?: string;
}
