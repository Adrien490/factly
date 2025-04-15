import { HTMLAttributes } from "react";

export type DotRingLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type DotRingLoaderColor =
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

export interface DotRingLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: DotRingLoaderSize;
	color?: DotRingLoaderColor;
	className?: string;
}
