"use client";

import MenuItem from "@/app/dashboard/(layout)/types/menu-item";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Structure simplifiée du menu

export interface HorizontalMenuProps {
	items: MenuItem[];
	className?: string;
	size?: "sm" | "default" | "lg";
	alignment?: "start" | "center" | "end";
}

const menuItemStyles = cva(
	"group inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 relative border-b-2 border-transparent hover:border-muted-foreground data-[active=true]:border-primary data-[active=true]:text-primary transition-all duration-200",
	{
		variants: {
			size: {
				sm: "h-8 px-3 py-1.5 text-xs",
				default: "h-10 px-4 py-2",
				lg: "h-12 px-5 py-2.5",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

export function HorizontalMenu({
	items,
	className,
	size = "default",
	alignment = "start",
}: HorizontalMenuProps) {
	const pathname = usePathname();

	const alignmentClasses = {
		start: "justify-start",
		center: "justify-center",
		end: "justify-end",
	};

	return (
		<NavigationMenu className={cn("relative z-10", className)}>
			<NavigationMenuList
				className={cn(
					"flex gap-1.5 p-1 bg-transparent",
					alignmentClasses[alignment],
					"overflow-x-auto scrollbar-hide sm:overflow-visible"
				)}
			>
				{items.map((item, index) => {
					const isActive = item.href === pathname;
					const isFirstItem = index === 0;

					return (
						<NavigationMenuItem key={`${item.label}-${index}`}>
							{item.items && item.items.length > 0 ? (
								// Élément avec sous-menu
								<>
									<NavigationMenuTrigger
										className={cn(
											menuItemStyles({ size }),
											item.disabled && "opacity-50 pointer-events-none",
											isFirstItem && "pl-0"
										)}
										disabled={item.disabled}
									>
										<span className="flex items-center gap-2">
											{item.icon && (
												<span className="w-4 h-4 shrink-0">{item.icon}</span>
											)}
											{item.label}
										</span>
									</NavigationMenuTrigger>
									<NavigationMenuContent className="min-w-[200px]">
										<ul className="grid gap-1 p-2">
											{item.items.map((subItem, subIndex) => (
												<li key={`${subItem.label}-${subIndex}`}>
													<NavigationMenuLink asChild>
														{subItem.href ? (
															<Link
																href={subItem.href}
																className={cn(
																	"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
																	isActive &&
																		"bg-accent/50 text-accent-foreground",
																	subItem.disabled &&
																		"opacity-50 pointer-events-none"
																)}
																onClick={subItem.onClick}
															>
																<div className="flex items-center gap-2 text-sm font-medium leading-none">
																	{subItem.icon && (
																		<span className="w-4 h-4 shrink-0">
																			{subItem.icon}
																		</span>
																	)}
																	{subItem.label}
																</div>
															</Link>
														) : (
															<button
																className={cn(
																	"w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
																	isActive &&
																		"bg-accent/50 text-accent-foreground",
																	subItem.disabled &&
																		"opacity-50 pointer-events-none"
																)}
																onClick={subItem.onClick}
																disabled={subItem.disabled}
															>
																<div className="flex items-center gap-2 text-sm font-medium leading-none">
																	{subItem.icon && (
																		<span className="w-4 h-4 shrink-0">
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
								// Élément simple
								<NavigationMenuLink asChild>
									{item.href ? (
										<Link
											href={item.href}
											className={cn(
												menuItemStyles({ size }),
												isActive &&
													"data-[active=true]:text-primary data-[active=true]:font-medium",
												item.disabled && "opacity-50 pointer-events-none",
												isFirstItem && "pl-0"
											)}
											onClick={item.onClick}
											data-active={isActive}
											aria-current={isActive ? "page" : undefined}
											aria-disabled={item.disabled}
										>
											<span className="flex items-center gap-2">
												{item.icon && (
													<span className="w-4 h-4 shrink-0">{item.icon}</span>
												)}
												{item.label}
											</span>
										</Link>
									) : (
										<button
											className={cn(
												menuItemStyles({ size }),
												isActive &&
													"data-[active=true]:text-primary data-[active=true]:font-medium",
												item.disabled && "opacity-50 pointer-events-none",
												isFirstItem && "pl-0"
											)}
											onClick={item.onClick}
											disabled={item.disabled}
											data-active={isActive}
											aria-current={isActive ? "page" : undefined}
										>
											<span className="flex items-center gap-2">
												{item.icon && (
													<span className="w-4 h-4 shrink-0">{item.icon}</span>
												)}
												{item.label}
											</span>
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
