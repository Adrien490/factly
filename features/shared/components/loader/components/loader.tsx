"use client";

import { cn } from "@/features/shared/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
