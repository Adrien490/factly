"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import {
	bgColorClass,
	colorClass,
	loaderAnimations,
	sizeClasses,
} from "./constants";
import { PulseLoaderProps } from "./types";

export function PulseLoader({
	size = "sm",
	color = "primary",
	className,
}: PulseLoaderProps) {
	return (
		<div
			className={cn(
				"relative flex items-center justify-center",
				sizeClasses.icons[size],
				className
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
	);
}
