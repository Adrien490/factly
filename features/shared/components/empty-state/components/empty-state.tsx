"use client";

import { cn } from "@/features/shared/lib/utils";
import { motion } from "framer-motion";
import { animations } from "../constants";
import { EmptyStateProps } from "../types";

export function EmptyState({
	className,
	icon: Icon,
	title,
	description,
	action,
	children,
	illustration,
	...props
}: EmptyStateProps) {
	return (
		<motion.div
			className={cn(
				"flex flex-col items-center justify-center text-center w-full p-6 bg-card rounded-lg",
				className
			)}
			{...animations.container}
			{...props}
		>
			{illustration ? (
				<motion.div className="mb-6" {...animations.icon}>
					{illustration}
				</motion.div>
			) : (
				Icon && (
					<motion.div
						className="rounded-full bg-muted/30 p-3 mb-4"
						{...animations.icon}
					>
						<Icon className="h-6 w-6 text-muted-foreground" />
					</motion.div>
				)
			)}

			<motion.div
				{...animations.item}
				className="text-lg font-medium text-foreground"
			>
				{title}
			</motion.div>

			{description && (
				<motion.div
					{...animations.item}
					className="mt-2 text-sm text-muted-foreground mx-auto max-w-2xl"
				>
					{description}
				</motion.div>
			)}

			{action && (
				<motion.div
					{...animations.item}
					className="mt-6 w-full flex justify-center"
				>
					{action}
				</motion.div>
			)}

			{children && (
				<motion.div {...animations.item} className="mt-6 w-full">
					{children}
				</motion.div>
			)}
		</motion.div>
	);
}
