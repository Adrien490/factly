"use client";

import { cn } from "@/shared/utils";
import { PageContainerProps } from "./types";

export function PageContainer({ children, className }: PageContainerProps) {
	return (
		<div
			className={cn(
				"px-4 sm:px-6 lg:px-8",

				className
			)}
		>
			{children}
		</div>
	);
}
