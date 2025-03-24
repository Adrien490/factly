"use client";

import { MenuItem } from "@/app/dashboard/(layout)/components/header/types";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface HorizontalMenuProps {
	items: MenuItem[];
	className?: string;
	size?: "sm" | "default" | "lg";
	alignment?: "start" | "center" | "end";
}

export function HorizontalMenu({
	items,
	className,
	size = "default",
	alignment = "start",
}: HorizontalMenuProps) {
	const pathname = usePathname();

	// Styles de base et variantes pour les éléments de menu
	const menuItemClasses = {
		base: "flex items-center justify-center text-sm font-medium transition-all relative border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		sizes: {
			sm: "h-8 px-3 py-1.5 text-xs gap-1.5",
			default: "h-10 px-4 py-2 gap-2",
			lg: "h-12 px-5 py-2.5 gap-2.5",
		},
		states: {
			active: "border-primary text-primary",
			inactive:
				"border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
			disabled: "opacity-50 pointer-events-none",
		},
	};

	// Styles pour le sous-menu
	const submenuItemClasses =
		"block rounded-md p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors";

	return (
		<NavigationMenu className={cn("relative z-10 w-full", className)}>
			<NavigationMenuList
				className={cn(
					"flex gap-2 overflow-x-auto sm:overflow-visible no-scrollbar",
					`justify-${alignment}`
				)}
			>
				{items.map((item, index) => {
					const isActive = pathname === item.href;
					const isFirstItem = index === 0;

					return (
						<NavigationMenuItem key={item.label ?? index}>
							{item.items?.length ? (
								// Élément avec sous-menu
								<>
									<NavigationMenuTrigger
										className={cn(
											menuItemClasses.base,
											menuItemClasses.sizes[size],
											isActive
												? menuItemClasses.states.active
												: menuItemClasses.states.inactive,
											isFirstItem && "pl-0"
										)}
									>
										{item.icon && (
											<span className="size-4 shrink-0">{item.icon}</span>
										)}
										{item.label}
									</NavigationMenuTrigger>

									<NavigationMenuContent className="min-w-52 p-2">
										<ul className="grid gap-1">
											{item.items.map((subItem, subIndex) => (
												<li key={subItem.label ?? subIndex}>
													<NavigationMenuLink asChild>
														{subItem.href ? (
															<Link
																href={subItem.href}
																className={cn(
																	submenuItemClasses,
																	pathname === subItem.href &&
																		"bg-accent/50 text-accent-foreground",
																	subItem.disabled &&
																		menuItemClasses.states.disabled
																)}
																onClick={subItem.onClick}
															>
																<div className="flex items-center gap-2">
																	{subItem.icon && (
																		<span className="size-4 shrink-0">
																			{subItem.icon}
																		</span>
																	)}
																	{subItem.label}
																</div>
															</Link>
														) : (
															<button
																className={cn(
																	submenuItemClasses,
																	"w-full text-left",
																	subItem.disabled &&
																		menuItemClasses.states.disabled
																)}
																onClick={subItem.onClick}
																disabled={subItem.disabled}
															>
																<div className="flex items-center gap-2">
																	{subItem.icon && (
																		<span className="size-4 shrink-0">
																			{subItem.icon}
																		</span>
																	)}
																	{subItem.label}
																</div>
															</button>
														)}
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</NavigationMenuContent>
								</>
							) : (
								// Élément simple (lien ou bouton)
								<NavigationMenuLink asChild>
									{item.href ? (
										<Link
											href={item.href}
											className={cn(
												menuItemClasses.base,
												menuItemClasses.sizes[size],
												isActive
													? menuItemClasses.states.active
													: menuItemClasses.states.inactive,
												item.disabled && menuItemClasses.states.disabled,
												isFirstItem && "pl-0"
											)}
											onClick={item.onClick}
											aria-current={isActive ? "page" : undefined}
										>
											{item.icon && (
												<span className="size-4 shrink-0">{item.icon}</span>
											)}
											{item.label}
										</Link>
									) : (
										<button
											className={cn(
												menuItemClasses.base,
												menuItemClasses.sizes[size],
												isActive
													? menuItemClasses.states.active
													: menuItemClasses.states.inactive,
												item.disabled && menuItemClasses.states.disabled,
												isFirstItem && "pl-0"
											)}
											onClick={item.onClick}
											disabled={item.disabled}
										>
											{item.icon && (
												<span className="size-4 shrink-0">{item.icon}</span>
											)}
											{item.label}
										</button>
									)}
								</NavigationMenuLink>
							)}
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
