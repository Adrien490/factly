"use client";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/features/shared/components/ui/navigation-menu";
import { cn } from "@/features/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorizontalMenuProps } from "../types";

// Définition interne du type MenuItem pour éviter la dépendance externe

export function HorizontalMenu({ items, className }: HorizontalMenuProps) {
	const pathname = usePathname();

	// Fonction pour déterminer si un item est actif
	const isItemActive = (href?: string) => {
		if (!href) return false;
		return pathname === href;
	};

	// Style de base pour les éléments de menu
	const baseMenuItemClass =
		"flex items-center justify-center text-sm font-medium transition-all relative border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 px-4 py-2 gap-2";

	// Style pour les sous-menus
	const submenuItemClass =
		"block rounded-md p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors";

	return (
		<NavigationMenu
			className={cn("relative z-10 w-full", className)}
			aria-label="Navigation principale"
		>
			<NavigationMenuList className="flex gap-2 overflow-x-auto sm:overflow-visible no-scrollbar justify-start">
				{items.map((item, index) => {
					const active = isItemActive(item.href);
					const isFirstItem = index === 0;

					// Classes communes pour les liens/boutons
					const itemClasses = cn(
						baseMenuItemClass,
						active
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
						item.disabled && "opacity-50 pointer-events-none",
						isFirstItem && "pl-0"
					);

					// Skip des items sans href (sauf pour les sous-menus)
					if (!item.href && !item.items?.length) {
						return null;
					}

					return (
						<NavigationMenuItem key={`${item.label}-${index}`}>
							{item.items?.length ? (
								// Élément avec sous-menu
								<>
									<NavigationMenuTrigger
										className={itemClasses}
										aria-expanded="false"
									>
										{item.icon && (
											<span className="size-4 shrink-0" aria-hidden="true">
												{item.icon}
											</span>
										)}
										{item.label}
									</NavigationMenuTrigger>

									<NavigationMenuContent className="min-w-52 p-2">
										<ul className="grid gap-1">
											{item.items.map((subItem, subIndex) => {
												const subItemActive = isItemActive(subItem.href);

												return (
													<li key={`${subItem.label}-${subIndex}`}>
														<NavigationMenuLink asChild>
															<Link
																href={subItem.href || "#"}
																className={cn(
																	submenuItemClass,
																	subItemActive &&
																		"bg-accent/50 text-accent-foreground",
																	subItem.disabled &&
																		"opacity-50 pointer-events-none"
																)}
																aria-current={
																	subItemActive ? "page" : undefined
																}
															>
																<div className="flex items-center gap-2">
																	{subItem.icon && (
																		<span
																			className="size-4 shrink-0"
																			aria-hidden="true"
																		>
																			{subItem.icon}
																		</span>
																	)}
																	{subItem.label}
																</div>
															</Link>
														</NavigationMenuLink>
													</li>
												);
											})}
										</ul>
									</NavigationMenuContent>
								</>
							) : (
								// Élément simple (lien)
								<NavigationMenuLink asChild>
									<Link
										href={item.href || "#"}
										className={itemClasses}
										aria-current={active ? "page" : undefined}
									>
										{item.icon && (
											<span className="size-4 shrink-0" aria-hidden="true">
												{item.icon}
											</span>
										)}
										{item.label}
									</Link>
								</NavigationMenuLink>
							)}
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
