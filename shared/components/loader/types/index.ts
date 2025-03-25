import { HTMLAttributes } from "react";

export type LoaderVariant = "spinner" | "pulse" | "dots";
export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoaderColor =
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
export type LoaderAlign = "start" | "center" | "end";

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: LoaderSize;
	text?: string;
	className?: string;
	variant?: LoaderVariant;
	color?: LoaderColor;
	align?: LoaderAlign;
}
