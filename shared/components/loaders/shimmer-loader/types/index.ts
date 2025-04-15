import { HTMLAttributes } from "react";

export type ShimmerLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ShimmerLoaderColor =
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

export interface ShimmerLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: ShimmerLoaderSize;
	color?: ShimmerLoaderColor;
	width?: string;
	className?: string;
}
