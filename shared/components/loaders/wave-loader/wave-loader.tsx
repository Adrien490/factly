"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { colorClass, loaderAnimations, sizeClasses } from "./constants";
import { WaveLoaderProps } from "./types";

export function WaveLoader({
	size = "sm",
	color = "primary",
	className,
}: WaveLoaderProps) {
	return (
		<motion.div
			className={cn("flex items-center space-x-1", className)}
			variants={loaderAnimations.wave.container}
			initial="initial"
			animate="animate"
		>
			{[0, 1, 2, 3, 4].map((i) => (
				<motion.span
					key={i}
					variants={loaderAnimations.wave.item}
					className={cn(
						"block rounded-full",
						sizeClasses.bars[size],
						colorClass[color]
					)}
					custom={i}
				/>
			))}
		</motion.div>
	);
}
