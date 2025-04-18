"use client";

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	LoadingIndicator,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NavigationDropdownProps } from "./types";

export function NavigationDropdown({ items }: NavigationDropdownProps) {
	const pathname = usePathname();

	// Si pas d'éléments, ne rien afficher
	if (!items.length) {
		return null;
	}

	// Vérifier si un élément est actif
	const isItemActive = (href: string) => pathname === href;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center gap-1">
					<span className="text-sm font-medium">Actions</span>
					<Button variant="ghost" size="sm">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</div>
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
