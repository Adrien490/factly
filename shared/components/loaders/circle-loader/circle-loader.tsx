"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { colorClass, loaderAnimations, sizeClasses } from "./constants";
import { CircleLoaderProps } from "./types";

export function CircleLoader({
	size = "sm",
	color = "primary",
	className,
}: CircleLoaderProps) {
	return (
		<div className={cn("relative flex items-center justify-center", className)}>
			<motion.svg
				className={cn(sizeClasses.icons[size])}
				viewBox="0 0 50 50"
				initial="initial"
				animate="animate"
			>
				<motion.circle
					cx="25"
					cy="25"
					r="20"
					fill="none"
					strokeWidth="4"
					stroke="currentColor"
					className={cn(colorClass[color])}
					strokeLinecap="round"
					variants={loaderAnimations.circle}
				/>
			</motion.svg>
		</div>
	);
}
