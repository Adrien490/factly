"use client";

import OrganizationSwitcher from "@/app/dashboard/[organizationId]/components/organization-switcher";
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
import { GetOrganizationsReturn } from "@/features/organizations/queries/get-organizations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { use } from "react";
import sidebarMenu from "../lib/sidebar-menu";

type Props = {
	organizationId: string;
	organizationsPromise: Promise<GetOrganizationsReturn>;
} & React.ComponentProps<typeof Sidebar>;

export default function OrganizationSidebar({
	organizationId,
	organizationsPromise,
	...props
}: Props) {
	const pathname = usePathname();
	const organizations = use(organizationsPromise);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<OrganizationSwitcher organizations={organizations} />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="pb-24">
				<SidebarGroup>
					<SidebarMenu>
						{sidebarMenu(organizationId).navMain.map((item) => {
							const Icon = item.icon;
							return (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<div className="flex items-center gap-2 font-medium">
											{Icon && <Icon className="h-4 w-4" />}
											{item.title}
										</div>
									</SidebarMenuButton>

									{item.items?.length ? (
										<SidebarMenuSub>
											{item.items.map((subItem) => {
												const isActive = pathname === subItem.url;
												return (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild isActive={isActive}>
															<Link href={subItem.url}>{subItem.title}</Link>
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
