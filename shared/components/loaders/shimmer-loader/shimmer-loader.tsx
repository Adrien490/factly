"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { colorClass, loaderAnimations, sizeClasses } from "./constants";
import { ShimmerLoaderProps } from "./types";

export function ShimmerLoader({
	size = "sm",
	color = "primary",
	width = "w-20",
	className,
}: ShimmerLoaderProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-md",
				sizeClasses.containers[size],
				width,
				className
			)}
		>
			<div className={cn("absolute inset-0", colorClass.bg[color])} />
			<motion.div
				className={cn(
					"absolute inset-0 -translate-x-full",
					colorClass.shimmer[color]
				)}
				variants={loaderAnimations.shimmer}
				initial="initial"
				animate="animate"
			/>
		</div>
	);
}
