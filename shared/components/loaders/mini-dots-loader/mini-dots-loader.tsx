"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { bgColorClass, loaderAnimations, sizeClasses } from "./constants";
import { MiniDotsLoaderProps } from "./types";

export function MiniDotsLoader({
	size = "sm",
	color = "primary",
	className,
}: MiniDotsLoaderProps) {
	return (
		<motion.div
			className={cn("inline-flex gap-0.5", className)}
			variants={loaderAnimations.container}
			initial="initial"
			animate="animate"
		>
			{[0, 1, 2].map((i) => (
				<motion.span
					key={i}
					variants={loaderAnimations.dot}
					className={cn(
						"inline-block rounded-full",
						sizeClasses.dots[size],
						bgColorClass[color]
					)}
					custom={i}
				/>
			))}
		</motion.div>
	);
}
