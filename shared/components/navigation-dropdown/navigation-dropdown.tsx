"use client";

import { Button } from "@/shared/components";
import { LoadingIndicator } from "@/shared/components/loading-indicator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NavigationDropdownProps } from "./types";

export function NavigationDropdown({
	items,
	className,
	label = "Navigation",
	icon = <Menu className="h-4 w-4 mr-2" />,
}: NavigationDropdownProps) {
	const pathname = usePathname();

	// Si pas d'éléments, ne rien afficher
	if (!items.length) {
		return null;
	}

	// Vérifier si un élément est actif
	const isItemActive = (href: string) => pathname === href;

	// Trouver l'élément actif pour l'afficher dans le bouton
	const activeItem = items.find((item) => isItemActive(item.href));
	const displayLabel = activeItem ? activeItem.label : label;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn("flex items-center gap-1", className)}
				>
					{icon}
					<span className="max-w-[150px] truncate">{displayLabel}</span>
					<ChevronDown className="h-4 w-4 ml-1 opacity-70" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				side="bottom"
				sideOffset={4}
				className="w-56"
			>
				{items.map((item, index) => (
					<React.Fragment key={`nav-item-${index}`}>
						{item.isSeparatorBefore && <DropdownMenuSeparator />}
						<DropdownMenuItem asChild>
							<Link
								href={item.href}
								className={cn(
									"flex w-full items-center gap-2 relative",
									isItemActive(item.href) && "bg-primary/5 font-medium"
								)}
							>
								{item.icon && (
									<span className="flex-shrink-0">{item.icon}</span>
								)}
								<span>{item.label}</span>
								<div className="ml-auto flex items-center">
									{isItemActive(item.href) && (
										<span className="h-1.5 w-1.5 rounded-full bg-primary mr-1" />
									)}
									<LoadingIndicator className="h-4 w-4" />
								</div>
							</Link>
						</DropdownMenuItem>
					</React.Fragment>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
