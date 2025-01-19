"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	/**
	 * Largeur maximale du contenu
	 * @default "7xl" (1280px)
	 */
	maxWidth?: "5xl" | "6xl" | "7xl" | "full";
}

export function PageContainer({
	children,
	maxWidth = "7xl",
	className,
	...props
}: PageContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8",
				{
					"max-w-5xl": maxWidth === "5xl",
					"max-w-6xl": maxWidth === "6xl",
					"max-w-7xl": maxWidth === "7xl",
					"max-w-[1440px]": maxWidth === "full",
				},
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
