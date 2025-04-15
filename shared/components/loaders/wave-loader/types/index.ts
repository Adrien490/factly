import { HTMLAttributes } from "react";

export type WaveLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type WaveLoaderColor =
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

export interface WaveLoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: WaveLoaderSize;
	color?: WaveLoaderColor;
	className?: string;
}
