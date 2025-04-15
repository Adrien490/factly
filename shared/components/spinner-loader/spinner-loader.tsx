"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { colorClass, loaderAnimations, sizeClasses } from "./constants";
import { SpinnerLoaderProps } from "./types";

export function SpinnerLoader({
	size = "sm",
	color = "primary",
	className,
}: SpinnerLoaderProps) {
	return (
		<motion.div
			variants={loaderAnimations.spinner}
			initial="initial"
			animate="animate"
			className={cn("flex items-center", className)}
		>
			<Loader2 className={cn(sizeClasses.icons[size], colorClass[color])} />
		</motion.div>
	);
}
