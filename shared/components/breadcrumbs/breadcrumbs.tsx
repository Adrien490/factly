import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { cn } from "@/shared/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BreadcrumbsProps } from "./types";

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
									<Link href={item.href} className="hover:text-foreground">
										{item.label}
									</Link>
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
