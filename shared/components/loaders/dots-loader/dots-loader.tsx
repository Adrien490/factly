"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { bgColorClass, loaderAnimations, sizeClasses } from "./constants";
import { DotsLoaderProps } from "./types";

export function DotsLoader({
	size = "sm",
	color = "primary",
	className,
}: DotsLoaderProps) {
	return (
		<motion.div
			className={cn("flex space-x-2 items-center", className)}
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
	);
}
