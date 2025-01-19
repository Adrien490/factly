"use client";

import { Building2, HelpCircle } from "lucide-react";
import * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MenuItem {
	title: string;
	icon?: React.ReactNode;
	path?: string;
	submenu?: MenuItem[];
}

function getMenu(): MenuItem[] {
	return [
		{
			title: "Organisations",
			icon: <Building2 className="size-4" />,
			submenu: [
				{
					title: "Liste des organisations",
					path: "/dashboard/organizations",
				},
				{
					title: "Créer une organisation",
					path: "/dashboard/organization/new",
				},
			],
		},
		{
			title: "Support client",
			icon: <HelpCircle className="size-4" />,
			path: "/dashboard/support",
		},
	];
}

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const menu = getMenu();

	return (
		<Sidebar
			{...props}
			className="h-[calc(100vh-4rem)] border-r md:sticky md:top-16"
			collapsible="offcanvas"
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
						Menu principal
					</SidebarGroupLabel>
					<SidebarMenu className="space-y-1 px-2">
						{menu.map((item) => {
							if (item.submenu) {
								return (
									<SidebarMenu key={item.title}>
										<SidebarMenuButton tooltip={item.title} className="w-full">
											<div className="flex w-full items-center gap-3">
												<div className="flex size-4 items-center justify-center">
													{item.icon}
												</div>
												<span className="truncate text-sm font-medium">
													{item.title}
												</span>
											</div>
										</SidebarMenuButton>
										<SidebarContent>
											{item.submenu.map((subitem) => (
												<SidebarMenuItem key={subitem.title}>
													<SidebarMenuButton
														asChild
														tooltip={subitem.title}
														className={cn(
															"",
															pathname === subitem.path &&
																"bg-accent text-accent-foreground"
														)}
													>
														<a
															href={subitem.path}
															className="flex w-full items-center gap-3"
														>
															<div className="flex size-4 items-center justify-center">
																{subitem.icon}
															</div>
															<span className="truncate text-sm font-medium">
																{subitem.title}
															</span>
														</a>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
										</SidebarContent>
									</SidebarMenu>
								);
							}

							return (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										className={cn(
											"",
											pathname === item.path &&
												"bg-accent text-accent-foreground"
										)}
									>
										<a
											href={item.path}
											className="flex w-full items-center gap-3"
										>
											<div className="flex size-4 items-center justify-center">
												{item.icon}
											</div>
											<span className="truncate text-sm font-medium">
												{item.title}
											</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
