"use client";

import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavMainProps } from "./types";

export function NavMain({ items }: NavMainProps) {
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";
	const pathname = usePathname();
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu principal</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const hasSubItems = item.items && item.items.length > 0;
					// Le menu principal est actif si le pathname correspond exactement à son URL
					const isMainItemActive = pathname === item.url;
					// Ou si l'un de ses sous-éléments est actif
					const hasActiveSubItem = item.items?.some(
						(subItem) => pathname === subItem.url
					);
					// État actif global pour le menu principal
					const isActive = isMainItemActive || hasActiveSubItem;

					// Rendu différent selon la présence ou non de sous-menus
					if (!hasSubItems) {
						// Menu simple sans sous-menus
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton tooltip={item.title} asChild>
									<Link
										href={item.url}
										className={cn(isActive && "bg-primary/10")}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					// Menu avec sous-menus
					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={item.isActive || hasActiveSubItem}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title} asChild>
										<Link
											href={isCollapsed ? item.url : ""}
											className={cn(
												(isActive && !hasSubItems) || (isActive && isCollapsed)
													? "bg-primary/10"
													: ""
											)}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</Link>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => {
											// Vérifier si ce sous-élément spécifique est actif
											const isSubItemActive = pathname === subItem.url;

											return (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<Link
															href={subItem.url}
															className={cn(
																isSubItemActive &&
																	!isCollapsed &&
																	"bg-primary/10"
															)}
														>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
