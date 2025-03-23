"use client";

import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";
import { HTMLAttributes } from "react";
import { LoaderAlign, LoaderColor, LoaderSize, LoaderVariant } from "./types";

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
	size?: LoaderSize;
	text?: string;
	className?: string;
	variant?: LoaderVariant;
	color?: LoaderColor;
	align?: LoaderAlign;
}

export function Loader({
	size = "sm",
	text,
	className,
	variant = "spinner",
	color = "default",
	align = "center",
	...props
}: LoaderProps) {
	// Configurations pour les différentes tailles et couleurs
	const sizeClasses = {
		icons: {
			xs: "h-3 w-3",
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		},
		dots: {
			xs: "h-1.5 w-1.5",
			sm: "h-2 w-2",
			md: "h-2.5 w-2.5",
			lg: "h-3 w-3",
		},
		text: {
			xs: "text-xs",
			sm: "text-xs",
			md: "text-sm",
			lg: "text-sm",
		},
	};

	const alignClass = {
		start: "justify-start",
		center: "justify-center",
		end: "justify-end",
	}[align];

	const colorClass = {
		default: "text-muted-foreground",
		primary: "text-primary",
		secondary: "text-secondary",
	}[color];

	const bgColorClass = {
		default: "bg-muted-foreground",
		primary: "bg-primary",
		secondary: "bg-secondary",
	}[color];

	return (
		<div
			className={cn("flex items-center gap-2", alignClass, className)}
			aria-live="polite"
			role="status"
			{...props}
		>
			{/* Loader basé sur la variante sélectionnée */}
			{variant === "dots" ? (
				<div className="flex space-x-2 items-center">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className={cn(
								"rounded-full",
								sizeClasses.dots[size],
								bgColorClass,
								"animate-bounce"
							)}
							style={{
								animationDuration: "0.8s",
								animationDelay: `${i * 0.15}s`,
							}}
						/>
					))}
				</div>
			) : variant === "pulse" ? (
				<div
					className={cn(
						"relative flex items-center justify-center",
						sizeClasses.icons[size]
					)}
				>
					<div
						className={cn(
							"absolute inset-0 rounded-full opacity-25 animate-ping",
							colorClass
						)}
					/>
					<div
						className={cn("rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5", colorClass)}
					/>
				</div>
			) : (
				<Loader2
					className={cn(sizeClasses.icons[size], "animate-spin", colorClass)}
				/>
			)}

			{/* Texte optionnel */}
			{text && (
				<span className={cn(sizeClasses.text[size], "font-medium", colorClass)}>
					{text}
				</span>
			)}
		</div>
	);
}
