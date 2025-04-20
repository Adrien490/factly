"use client";

import { ChevronRight } from "lucide-react";

import { LoadingIndicator } from "@/shared/components/loading-indicator";
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
import { useParams, usePathname } from "next/navigation";
import { navItems } from "../../constants";

export function NavMain() {
	const pathname = usePathname();
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";
	const params = useParams();
	const organizationId = params.organizationId as string;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu principal</SidebarGroupLabel>
			<SidebarMenu>
				{navItems(organizationId).map((item) => {
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
										href={item.url ?? ""}
										className={cn(
											"flex items-center justify-between",
											isActive && "bg-sidebar-accent"
										)}
									>
										<div className="flex items-center gap-2">
											{item.icon && <item.icon className="size-4" />}
											{!isCollapsed && !hasSubItems && (
												<span>{item.title}</span>
											)}
										</div>
										<LoadingIndicator />
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
							defaultOpen={isActive || hasActiveSubItem}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title} asChild>
										<Link
											href={isCollapsed ? item.url ?? "" : ""}
											className={cn(
												(isActive && !hasSubItems) || (isActive && isCollapsed)
													? "bg-sidebar-accent"
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
																"flex items-center justify-between",
																isSubItemActive &&
																	!isCollapsed &&
																	"bg-sidebar-accent"
															)}
														>
															<span>{subItem.title}</span>
															<LoadingIndicator />
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
