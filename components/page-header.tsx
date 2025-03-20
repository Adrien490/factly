"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	breadcrumbs?: Array<{
		label: string;
		href: string;
	}>;
	action?: React.ReactNode;
}

export default function PageHeader({
	title,
	description,
	breadcrumbs,
	action,
	className,
	...props
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"mb-6 flex flex-col gap-4 pt-4 sm:mb-8 sm:pt-6 lg:mb-10 lg:pt-8",
				className
			)}
			{...props}
		>
			{breadcrumbs && (
				<div className="flex items-center">
					<Breadcrumbs items={breadcrumbs} />
				</div>
			)}
			<div className="flex flex-col gap-1.5">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{title}
						</h1>
						{description && (
							<p className="text-sm text-muted-foreground sm:text-base">
								{description}
							</p>
						)}
					</div>
					{action && <div className="mt-2 md:mt-0">{action}</div>}
				</div>
			</div>
		</div>
	);
}
