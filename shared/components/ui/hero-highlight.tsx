"use client";
import { cn } from "@/shared/utils";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
} from "framer-motion";
import React from "react";

export const HeroHighlight = ({
	children,
	className,
	containerClassName,
}: {
	children: React.ReactNode;
	className?: string;
	containerClassName?: string;
}) => {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const prefersReducedMotion = useReducedMotion();

	function handleMouseMove({
		currentTarget,
		clientX,
		clientY,
	}: React.MouseEvent<HTMLDivElement>) {
		if (!currentTarget || prefersReducedMotion) return;
		const { left, top } = currentTarget.getBoundingClientRect();

		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	return (
		<div
			className={cn(
				"relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group",
				containerClassName
			)}
			onMouseMove={handleMouseMove}
			aria-label={typeof children === "string" ? children : undefined}
		>
			<div
				className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none"
				aria-hidden="true"
			/>
			<motion.div
				className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500 absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
				style={{
					WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
					maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
				}}
				aria-hidden="true"
			/>

			<div className={cn("relative z-20", className)}>{children}</div>
		</div>
	);
};

export const Highlight = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.span
			initial={
				prefersReducedMotion
					? { backgroundSize: "100% 100%" }
					: { backgroundSize: "0% 100%" }
			}
			animate={{ backgroundSize: "100% 100%" }}
			transition={
				prefersReducedMotion
					? { duration: 0 }
					: { duration: 2, ease: "linear", delay: 0.5 }
			}
			style={{
				backgroundRepeat: "no-repeat",
				backgroundPosition: "left center",
				display: "inline",
			}}
			className={cn(
				`relative inline-block pb-1 px-1 rounded-lg bg-linear-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
				className
			)}
		>
			{children}
		</motion.span>
	);
};
