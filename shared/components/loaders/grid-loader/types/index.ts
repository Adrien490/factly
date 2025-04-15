import { HTMLAttributes } from "react";

export type GridLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type GridLoaderColor =
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

export interface GridLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: GridLoaderSize;
	color?: GridLoaderColor;
	className?: string;
}
