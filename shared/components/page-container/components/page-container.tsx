"use client";

import { cn } from "@/shared/lib/utils";
import * as React from "react";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function PageContainer({
	children,

	className,
	...props
}: PageContainerProps) {
	return (
		<div
			className={cn(
				"px-4 sm:px-6 lg:px-8",

				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
