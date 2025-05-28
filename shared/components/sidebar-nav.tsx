"use client";

import { ChevronRight, LucideIcon } from "lucide-react";

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
import { cn, getSidebarNav } from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavMainProps {
	items: {
		title: string;
		url?: string;
		icon?: LucideIcon;
		isActive?: boolean;
		isSection?: boolean;
		items?: {
			title: string;
			url?: string;
			icon?: LucideIcon;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	}[];
}

export function SidebarNav() {
	const pathname = usePathname();
	const { state } = useSidebar();
	const items = getSidebarNav();

	const renderMenuItem = (item: {
		title: string;
		url?: string;
		icon?: LucideIcon;
		items?: {
			title: string;
			url?: string;
			icon?: LucideIcon;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	}) => {
		const hasSubItems = item.items && item.items.length > 0;

		// Vérifier si l'item ou ses sous-items sont actifs
		const isMainItemActive = item.url && pathname === item.url;
		const hasActiveSubItem = item.items?.some((subItem) => {
			if (subItem.url && pathname === subItem.url) return true;
			return subItem.items?.some((deepSubItem) => pathname === deepSubItem.url);
		});
		const isActive = isMainItemActive || hasActiveSubItem;

		// Menu simple sans sous-menus
		if (!hasSubItems && item.url) {
			return (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton
						tooltip={state === "collapsed" ? item.title : undefined}
						asChild
					>
						<Link
							href={item.url}
							className={cn(
								"flex items-center justify-between",
								isActive && "bg-sidebar-accent"
							)}
						>
							<div className="flex items-center gap-2">
								{item.icon && <item.icon className="size-4" />}
								<span className={cn(state === "collapsed" && "sr-only")}>
									{item.title}
								</span>
							</div>
							{state !== "collapsed" && <LoadingIndicator />}
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		}

		// Menu avec sous-menus - en mode collapsed, on affiche seulement l'icône avec tooltip
		if (state === "collapsed" && hasSubItems) {
			// Si l'item a une URL, on le rend cliquable même en mode collapsed
			if (item.url) {
				return (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton
							tooltip={`${item.title}\n${item.items?.map((subItem) => `• ${subItem.title}`).join("\n")}`}
							asChild
						>
							<Link
								href={item.url}
								className={cn(
									"flex items-center justify-between",
									isActive && "bg-sidebar-accent"
								)}
							>
								<div className="flex items-center gap-2">
									{item.icon && <item.icon className="size-4" />}
									<span className="sr-only">{item.title}</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				);
			}

			// En mode collapsed, on crée un tooltip avec tous les sous-items
			const tooltipContent = `${item.title}\n${item.items?.map((subItem) => `• ${subItem.title}`).join("\n")}`;

			return (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton tooltip={tooltipContent}>
						<div className="flex items-center gap-2">
							{item.icon && <item.icon className="size-4" />}
							<span className="sr-only">{item.title}</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		}

		// Menu avec sous-menus en mode étendu
		return (
			<Collapsible
				key={item.title}
				asChild
				defaultOpen={isActive || hasActiveSubItem}
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							tooltip={state === "collapsed" ? item.title : undefined}
						>
							<div className="flex items-center gap-2 w-full">
								{item.icon && <item.icon className="size-4" />}
								<span className="flex-1">{item.title}</span>
								<ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							</div>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map((subItem) => {
								const subHasItems = subItem.items && subItem.items.length > 0;
								const isSubItemActive = subItem.url && pathname === subItem.url;
								const hasActiveDeepItem = subItem.items?.some(
									(deepItem) => pathname === deepItem.url
								);

								if (!subHasItems && subItem.url) {
									return (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<Link
													href={subItem.url}
													className={cn(
														"flex items-center justify-between",
														isSubItemActive && "bg-sidebar-accent"
													)}
												>
													<div className="flex items-center gap-2">
														{subItem.icon && (
															<subItem.icon className="size-4" />
														)}
														<span>{subItem.title}</span>
													</div>
													<LoadingIndicator />
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									);
								}

								// Sous-menu avec des items
								return (
									<Collapsible
										key={subItem.title}
										asChild
										defaultOpen={isSubItemActive || hasActiveDeepItem}
										className="group/subcollapsible"
									>
										<SidebarMenuSubItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuSubButton>
													<div className="flex items-center gap-2 w-full">
														{subItem.icon && (
															<subItem.icon className="size-4" />
														)}
														<span className="flex-1">{subItem.title}</span>
														<ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
													</div>
												</SidebarMenuSubButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<div className="ml-4 space-y-1">
													{subItem.items?.map((deepItem) => {
														const isDeepItemActive = pathname === deepItem.url;
														return (
															<SidebarMenuSubButton
																key={deepItem.title}
																asChild
															>
																<Link
																	href={deepItem.url}
																	className={cn(
																		"flex items-center justify-between text-sm",
																		isDeepItemActive && "bg-sidebar-accent"
																	)}
																>
																	<span>{deepItem.title}</span>
																	<LoadingIndicator />
																</Link>
															</SidebarMenuSubButton>
														);
													})}
												</div>
											</CollapsibleContent>
										</SidebarMenuSubItem>
									</Collapsible>
								);
							})}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		);
	};

	return (
		<>
			{items.map((item) => {
				// Si c'est une section, créer un groupe séparé
				if (item.isSection) {
					return (
						<SidebarGroup key={item.title} className="py-1">
							<SidebarGroupLabel
								className={cn(
									"text-xs font-medium text-sidebar-foreground/80 mb-1",
									state === "collapsed" && "sr-only"
								)}
							>
								{item.title}
							</SidebarGroupLabel>
							<SidebarMenu>
								{item.items?.map((subItem) => renderMenuItem(subItem))}
							</SidebarMenu>
						</SidebarGroup>
					);
				}

				// Sinon, afficher dans le groupe principal
				return (
					<SidebarGroup key="main">
						<SidebarGroupLabel
							className={cn(state === "collapsed" && "sr-only")}
						>
							Menu principal
						</SidebarGroupLabel>
						<SidebarMenu>{renderMenuItem(item)}</SidebarMenu>
					</SidebarGroup>
				);
			})}
		</>
	);
}
