"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { bgColorClass, loaderAnimations, sizeClasses } from "./constants";
import { ProgressLoaderProps } from "./types";

export function ProgressLoader({
	size = "sm",
	color = "primary",
	className,
}: ProgressLoaderProps) {
	return (
		<div
			className={cn(
				"relative w-full overflow-hidden rounded-full",
				sizeClasses.container[size],
				"bg-muted/50",
				className
			)}
		>
			<motion.div
				className={cn("h-full rounded-full", bgColorClass[color])}
				variants={loaderAnimations.progress}
				initial="initial"
				animate="animate"
			/>
		</div>
	);
}
