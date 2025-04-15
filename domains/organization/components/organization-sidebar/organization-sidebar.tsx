"use client";

import { OrganizationSwitcher } from "@/domains/organization/components/organization-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/shared/components/shadcn-ui/sidebar";
import { use } from "react";
import { NavMain } from "./components/nav-main/nav-main";
import { navItems } from "./constants";
import { AppSidebarProps } from "./types";

export function OrganizationSidebar({
	organizationId,
	organizationsPromise,
	...props
}: AppSidebarProps) {
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
						<OrganizationSwitcher organizations={organizations} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="pt-2">
				<NavMain
					isCollapsed={isCollapsed}
					items={navItems(organizationId).navMain}
				/>
			</SidebarContent>
			<SidebarRail className="bg-muted/10" />
		</Sidebar>
	);
}
