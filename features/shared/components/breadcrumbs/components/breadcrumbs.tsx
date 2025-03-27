import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/features/shared/components/ui/breadcrumb";
import { cn } from "@/features/shared/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
	items: Array<{
		label: string;
		href?: string;
	}>;
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
	if (!items?.length) return null;

	return (
		<nav
			aria-label="Fil d'ariane"
			className={cn("flex items-center", className)}
			{...props}
		>
			<Breadcrumb>
				<BreadcrumbList>
					{items.map((item, index) => (
						<React.Fragment key={index}>
							<BreadcrumbItem>
								{item.href ? (
									<BreadcrumbLink
										href={item.href}
										className="hover:text-foreground"
									>
										{item.label}
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
							{index < items.length - 1 && (
								<BreadcrumbSeparator>
									<ChevronRight className="h-4 w-4" />
								</BreadcrumbSeparator>
							)}
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</nav>
	);
}
