"use client";

import {
	HorizontalMenu,
	HorizontalMenuProps,
} from "@/shared/components/horizontal-menu/components/horizontal-menu";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	navigation?: HorizontalMenuProps;
	action?: React.ReactNode;
}

export function PageHeader({
	title,
	description,
	navigation,
	action,
	className,
	...props
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"mb-6 flex flex-col justify-center gap-4 mt-4 sm:mb-8 lg:mb-10 border-b border-border/50",
				className
			)}
			{...props}
		>
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
					{action && <div className="md:ml-auto mt-2 md:mt-0">{action}</div>}
				</div>
			</div>
			{navigation && <HorizontalMenu items={navigation.items} />}
		</div>
	);
}
