"use client";

import { GetOrganizationsReturn } from "@/features/organization/get-all";
import { OrganizationSwitcher } from "@/features/shared/components/organization-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from "@/features/shared/components/ui/sidebar";
import { cn } from "@/features/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { use } from "react";
import { sidebarNavigation } from "../constants";

type Props = {
	organizationId: string;
	organizationsPromise: Promise<GetOrganizationsReturn>;
} & React.ComponentProps<typeof Sidebar>;

export function OrganizationSidebar({
	organizationId,
	organizationsPromise,
	...props
}: Props) {
	const pathname = usePathname();
	const organizations = use(organizationsPromise);
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";

	return (
		<Sidebar
			collapsible="icon"
			className="bg-background border-r border-border/30"
			{...props}
		>
			<SidebarHeader className="border-b border-border/30 bg-background/70">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<OrganizationSwitcher organizations={organizations} />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="pt-2">
				<SidebarGroup>
					<SidebarMenu>
						{sidebarNavigation(organizationId).navMain.map((item) => {
							const Icon = item.icon;
							const isItemActive = item.url && pathname === item.url;
							const hasActiveSubItem = item.items?.some(
								(subItem) => pathname === subItem.url
							);

							// En mode normal, un menu principal n'est pas actif si un sous-menu est actif
							const shouldShowActive = isCollapsed
								? isItemActive
								: isItemActive && !hasActiveSubItem;

							return (
								<SidebarMenuItem key={item.title} className="mb-0.5">
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										className={cn(
											shouldShowActive && "bg-accent text-accent-foreground"
										)}
									>
										{item.url ? (
											<Link href={item.url} className="w-full">
												<div className="flex items-center gap-2 py-1.5">
													{Icon && (
														<Icon
															className={cn(
																"h-4 w-4",
																shouldShowActive
																	? "text-accent-foreground"
																	: hasActiveSubItem
																	? "text-accent-foreground"
																	: "text-muted-foreground"
															)}
														/>
													)}
													<span className="group-data-[collapsible=icon]:hidden">
														{item.title}
													</span>
												</div>
											</Link>
										) : (
											<div className="flex items-center gap-2 py-1.5">
												{Icon && (
													<Icon
														className={cn(
															"h-4 w-4",
															hasActiveSubItem
																? "text-accent-foreground"
																: "text-muted-foreground"
														)}
													/>
												)}
												<span className="group-data-[collapsible=icon]:hidden">
													{item.title}
												</span>
											</div>
										)}
									</SidebarMenuButton>

									{item.items?.length ? (
										<SidebarMenuSub>
											{item.items.map((subItem) => {
												const isSubActive = pathname === subItem.url;
												return (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton
															asChild
															isActive={isSubActive}
															className={
																isSubActive
																	? "bg-primary text-primary-foreground"
																	: ""
															}
														>
															<Link
																href={subItem.url}
																className="pl-6 w-full text-sm py-1.5"
															>
																{subItem.title}
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												);
											})}
										</SidebarMenuSub>
									) : null}
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail className="bg-muted/10" />
		</Sidebar>
	);
}
