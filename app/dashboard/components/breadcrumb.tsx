"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
	const pathname = usePathname();

	return (
		<nav
			aria-label="breadcrumb"
			className={cn("flex items-center space-x-2", className)}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				const isActive = pathname === item.href;

				return (
					<div key={index} className="flex items-center">
						{index > 0 && (
							<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/40" />
						)}
						{isLast || isActive ? (
							<span className="text-sm font-medium text-foreground">
								{item.label}
							</span>
						) : (
							<Link
								href={item.href}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								{item.label}
							</Link>
						)}
					</div>
				);
			})}
		</nav>
	);
}
