"use client";

import OrganizationSwitcher from "@/app/dashboard/(with-sidebar)/organizations/components/organization-switcher";
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
} from "@/components/ui/sidebar";
import { Organization } from "@prisma/client";
import { LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { use } from "react";

type OrganizationDashboardSidebarProps = {
	organizationId: string;
	organizationsPromise: Promise<Organization[]>;
} & React.ComponentProps<typeof Sidebar>;

export default function OrganizationDashboardSidebar({
	organizationId,
	organizationsPromise,
	...props
}: OrganizationDashboardSidebarProps) {
	const pathname = usePathname();
	const organizations = use(organizationsPromise);
	const navigation = {
		navMain: [
			{
				title: "Dashboard",
				url: `/dashboard/${organizationId}`,
				icon: LayoutDashboard,
			},
			{
				title: "Clients",
				url: `/dashboard/${organizationId}/clients`,
				icon: Users,
				items: [
					{
						title: "Liste des clients",
						url: `/dashboard/${organizationId}/clients`,
					},
					{
						title: "Ajouter un client",
						url: `/dashboard/${organizationId}/clients/new`,
					},
				],
			},
		],
	};

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<OrganizationSwitcher organizations={organizations} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{navigation.navMain.map((item) => {
							const Icon = item.icon;

							return (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a
											href={item.url}
											className="flex items-center gap-2 font-medium"
										>
											{Icon && <Icon className="h-4 w-4" />}
											{item.title}
										</a>
									</SidebarMenuButton>
									{item.items?.length ? (
										<SidebarMenuSub>
											{item.items.map((subItem) => {
												return (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton
															asChild
															isActive={pathname === subItem.url}
														>
															<a
																href={subItem.url}
																className="flex items-center gap-2"
															>
																{subItem.title}
															</a>
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
			<SidebarRail />
		</Sidebar>
	);
}
