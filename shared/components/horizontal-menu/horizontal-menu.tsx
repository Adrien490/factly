"use client";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/shared/components/ui/navigation-menu";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorizontalMenuProps } from "./types";

export function HorizontalMenu({ items, className }: HorizontalMenuProps) {
	const pathname = usePathname();

	// Check if menu should be rendered
	if (!items.length || (!items[0].href && !items[0].items?.length)) {
		return null;
	}

	// Check if a menu item matches the current path
	const isItemActive = (href?: string) => {
		if (!href) return false;
		return pathname === href;
	};

	return (
		<NavigationMenu
			className={cn("relative z-10 w-full", className)}
			aria-label="Main navigation"
		>
			<NavigationMenuList className="flex overflow-x-auto sm:overflow-visible no-scrollbar gap-6">
				{items.map((item, index) => (
					<NavigationMenuItem key={index}>
						<NavigationMenuLink asChild>
							<Link
								href={item.href || "#"}
								className={cn(
									"flex items-center text-sm text-muted-foreground transition-colors gap-2",
									isItemActive(item.href)
										? "text-primary"
										: "text-muted-foreground hover:text-foreground"
								)}
								aria-current={isItemActive(item.href) ? "page" : undefined}
							>
								{item.icon && (
									<span className="size-4 shrink-0 mr-2" aria-hidden="true">
										{item.icon}
									</span>
								)}
								<span
									className={cn(
										"border-b-2 border-transparent pb-[8px]",
										isItemActive(item.href) ? "border-primary" : ""
									)}
								>
									{item.label}
								</span>
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
