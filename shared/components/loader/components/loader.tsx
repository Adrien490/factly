"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { LoaderFullscreen } from "../../loader-fullscreen";
import {
	alignClass,
	bgColorClass,
	colorClass,
	loaderAnimations,
	sizeClasses,
} from "../constants";
import { LoaderProps } from "../types";

export function Loader({
	size = "sm",
	text,
	className,
	variant = "spinner",
	color = "primary",
	align = "center",
	...props
}: LoaderProps) {
	return (
		<div
			className={cn("flex items-center gap-3", alignClass[align], className)}
			aria-live="polite"
			role="status"
			{...props}
		>
			{/* Loader basé sur la variante sélectionnée */}
			{variant === "dots" ? (
				<motion.div
					className="flex space-x-2 items-center"
					variants={loaderAnimations.dots.container}
					initial="initial"
					animate="animate"
				>
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							variants={loaderAnimations.dots.item}
							className={cn(
								"rounded-full",
								sizeClasses.dots[size],
								bgColorClass[color]
							)}
						/>
					))}
				</motion.div>
			) : variant === "pulse" ? (
				<div
					className={cn(
						"relative flex items-center justify-center",
						sizeClasses.icons[size]
					)}
				>
					<motion.div
						variants={loaderAnimations.pulse}
						initial="initial"
						animate="animate"
						className={cn(
							"absolute rounded-full",
							sizeClasses.icons[size],
							colorClass[color]
						)}
					/>
					<div
						className={cn(
							"rounded-full",
							sizeClasses.dots[size],
							bgColorClass[color]
						)}
					/>
				</div>
			) : (
				<motion.div
					variants={loaderAnimations.spinner}
					initial="initial"
					animate="animate"
					className="flex items-center justify-center"
				>
					<Loader2 className={cn(sizeClasses.icons[size], colorClass[color])} />
				</motion.div>
			)}

			{/* Texte optionnel */}
			{text && (
				<motion.span
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className={cn(
						sizeClasses.text[size],
						"font-medium",
						colorClass[color]
					)}
				>
					{text}
				</motion.span>
			)}
		</div>
	);
}

// Ajouter le composant LoaderFullscreen comme propriété de Loader
Loader.Fullscreen = LoaderFullscreen;

// Bouton avec état de chargement intégré
Loader.Button = function LoaderButton({
	children,
	loading = false,
	disabled,
	loaderSize = "sm",
	loaderColor = "white",
	variant = "spinner",
	className,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
	loaderSize?: LoaderProps["size"];
	loaderColor?: LoaderProps["color"];
	variant?: LoaderProps["variant"];
}) {
	return (
		<button
			disabled={disabled || loading}
			className={cn(
				"relative inline-flex items-center justify-center",
				loading && "cursor-not-allowed",
				className
			)}
			{...props}
		>
			{loading && (
				<span className="absolute inset-0 flex items-center justify-center">
					<Loader variant={variant} size={loaderSize} color={loaderColor} />
				</span>
			)}
			<span className={cn(loading && "invisible")}>{children}</span>
		</button>
	);
};
