"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
	title: string;
	description?: string;
	breadcrumbs?: Array<{
		label: string;
		href: string;
	}>;
	className?: string;
};

export default function PageHeader({
	title,
	description,
	breadcrumbs,
	className,
}: PageHeaderProps) {
	return (
		<div className={cn("mb-6 flex flex-col gap-4 sm:mb-8 lg:mb-10", className)}>
			{breadcrumbs && (
				<div className="flex items-center">
					<Breadcrumbs items={breadcrumbs} />
				</div>
			)}
			<div className="flex flex-col gap-1.5">
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					{title}
				</h1>
				{description && (
					<p className="text-sm text-muted-foreground sm:text-base">
						{description}
					</p>
				)}
			</div>
		</div>
	);
}
