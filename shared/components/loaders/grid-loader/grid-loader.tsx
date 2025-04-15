"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { bgColorClass, loaderAnimations, sizeClasses } from "./constants";
import { GridLoaderProps } from "./types";

export function GridLoader({
	size = "sm",
	color = "primary",
	className,
}: GridLoaderProps) {
	return (
		<motion.div
			className={cn(
				"grid grid-cols-3 gap-1",
				sizeClasses.container[size],
				className
			)}
			variants={loaderAnimations.container}
			initial="initial"
			animate="animate"
		>
			{[...Array(9)].map((_, i) => (
				<motion.div
					key={i}
					variants={loaderAnimations.item}
					custom={i}
					className={cn("rounded-sm", bgColorClass[color])}
				/>
			))}
		</motion.div>
	);
}
