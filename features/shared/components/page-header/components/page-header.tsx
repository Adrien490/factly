"use client";

import { Breadcrumbs } from "@/features/shared/components/breadcrumbs";
import {
	HorizontalMenu,
	HorizontalMenuProps,
} from "@/features/shared/components/horizontal-menu";
import { cn } from "@/features/shared/lib/utils";
import React from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	navigation?: HorizontalMenuProps;
	action?: React.ReactNode;
	breadcrumbs?: Array<{
		label: string;
		href?: string;
	}>;
}

export function PageHeader({
	title,
	description,
	navigation,
	action,
	breadcrumbs,
	className,
	...props
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"py-4 space-y-4 mb-6 sm:mb-8 lg:mb-10 border-b border-border/50",
				className
			)}
			{...props}
		>
			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumbs items={breadcrumbs} className="text-sm mb-2" />
			)}

			<div className="flex flex-col gap-1.5">
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
					<div className="space-y-1.5">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{title}
						</h1>
						{description && (
							<p className="text-sm text-muted-foreground sm:text-base max-w-prose">
								{description}
							</p>
						)}
					</div>

					{action && (
						<div className="md:ml-auto mt-2 md:mt-0 shrink-0">{action}</div>
					)}
				</div>
			</div>

			{navigation && (
				<div className="pt-1">
					<HorizontalMenu items={navigation.items} />
				</div>
			)}
		</div>
	);
}
