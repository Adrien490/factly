"use client";

import { cn } from "@/features/shared/lib/utils";
import { type VariantProps } from "class-variance-authority";
import React from "react";
import { logoBackgroundVariants, logoVariants } from "../constants";

// Définition des variantes pour le composant Logo avec des valeurs standardisées

// Définition des propriétés du composant Logo
export interface LogoProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof logoVariants>,
		Omit<VariantProps<typeof logoBackgroundVariants>, "variant"> {
	hideText?: boolean;
	text?: string;
	textSize?: "xs" | "sm" | "md" | "lg";
	textPosition?: "right" | "bottom" | "left";
	customIcon?: React.ReactNode;
	badge?: string;
	badgeColor?: "primary" | "secondary" | "accent" | "destructive" | "default";
	label?: string;
	withBorder?: boolean;
	animate?: boolean;
	srText?: string;
}

// Composant Logo principal avec amélioration d'accessibilité
export function Logo({
	className,
	variant = "default",
	size,
	shape,
	glow,
	hover,
	hideText = true,
	text = "Factly",
	textSize = "md",
	textPosition = "right",
	customIcon,
	interactive,
	elevation,
	badge,
	badgeColor = "primary",
	label,
	withBorder = true,
	animate = false,
	srText,
	...props
}: LogoProps) {
	// Définition des tailles de texte standardisées
	const textSizes = {
		xs: "text-xs font-medium",
		sm: "text-sm font-semibold",
		md: "text-base font-semibold tracking-wide",
		lg: "text-lg font-bold tracking-wide",
	};

	// Badge colors mapping avec contraste amélioré
	const badgeColors = {
		primary: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		accent: "bg-accent text-accent-foreground",
		destructive: "bg-destructive text-destructive-foreground",
		default: "bg-muted text-muted-foreground",
	};

	return (
		<div
			className={cn(
				"group flex items-center gap-3 select-none",
				textPosition === "bottom" && "flex-col",
				textPosition === "left" && "flex-row-reverse",
				animate && "motion-safe:animate-fadeIn",
				className
			)}
			{...props}
		>
			{/* Texte accessible pour les lecteurs d'écran */}
			{(label || srText) && (
				<span className="sr-only" id="logo-label">
					{srText || label || `Logo ${text}`}
				</span>
			)}
			<div
				className={cn(
					logoVariants({ variant, size, shape, interactive, elevation })
				)}
				aria-labelledby={label || srText ? "logo-label" : undefined}
				role={interactive ? "button" : undefined}
				tabIndex={interactive ? 0 : undefined}
				aria-pressed={interactive ? false : undefined}
				onKeyDown={
					interactive
						? (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									e.currentTarget.click();
								}
						  }
						: undefined
				}
			>
				{/* Glow Effect */}
				<div className={cn(logoBackgroundVariants({ variant, glow, hover }))} />

				{/* Container du logo avec focus visible amélioré */}
				<div
					className={cn(
						"relative flex items-center justify-center w-full h-full bg-background/80 dark:bg-card/90 shadow-2xs z-10 backdrop-blur-xs transition-all duration-300 group-hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
						withBorder && "border border-border group-hover:border-primary/30",
						shape === "square" && "rounded-lg",
						shape === "softSquare" && "rounded-xl",
						shape === "circle" && "rounded-full",
						shape === "card" && "rounded-xl"
					)}
				>
					{/* Badge avec position améliorée */}
					{badge && (
						<div className="absolute -top-2 -right-2 z-20">
							<div
								className={cn(
									"text-[10px] font-bold px-1.5 py-0.5 rounded-full",
									badgeColors[badgeColor],
									"ring-2 ring-background dark:ring-card"
								)}
							>
								{badge}
							</div>
						</div>
					)}

					{/* Logo Icon avec meilleur scaling */}
					{customIcon || (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className={cn(
								"transition-all duration-300 drop-shadow-xs group-hover:drop-shadow-md",
								animate
									? "group-hover:animate-pulse-once"
									: "group-hover:scale-110",
								size === "xs" && "w-3 h-3",
								size === "sm" && "w-4 h-4",
								size === "md" && "w-5 h-5",
								size === "lg" && "w-7 h-7",
								size === "xl" && "w-10 h-10"
							)}
							aria-hidden="true"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5z" />
							<path d="M2 17l10 5 10-5" />
							<path d="M2 12l10 5 10-5" />
						</svg>
					)}

					{/* Effet de surlignement au hover amélioré */}
					<div
						className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-primary transition-opacity duration-300 pointer-events-none"
						style={{
							borderRadius: "inherit",
						}}
					/>
				</div>
			</div>

			{/* Logo Text avec espacement et animation améliorés */}
			{!hideText && (
				<span
					className={cn(
						"transition-all duration-300 drop-shadow-xs group-hover:drop-shadow-md group-hover:translate-y-[-1px] group-focus-within:translate-y-[-1px]",
						textSizes[textSize],
						variant === "default" && "text-primary group-hover:text-primary/90",
						variant === "accent" &&
							"text-accent-foreground group-hover:text-accent-foreground/90",
						variant === "dark" &&
							"text-foreground group-hover:text-foreground/90",
						variant === "light" &&
							"text-background group-hover:text-background/90",
						variant === "modern" && "text-primary/90 group-hover:text-primary",
						variant === "minimal" &&
							"text-foreground/80 group-hover:text-primary",
						variant === "gradient" &&
							"bg-linear-to-r from-primary to-indigo-500 text-transparent bg-clip-text font-bold"
					)}
				>
					{text}
				</span>
			)}
		</div>
	);
}
