import {
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/shared/components";
import { Sidebar } from "@/shared/components/ui/sidebar";
import { Suspense } from "react";
import { getOrganizations } from "../../features";
import { NavMain } from "./components/nav-main";
import { OrganizationSwitcher } from "./components/organization-switcher";
import { OrganizationSwitcherSkeleton } from "./components/organization-switcher-skeleton";

export function OrganizationSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="border-b border-border/30">
				<SidebarMenu>
					<SidebarMenuItem>
						<Suspense fallback={<OrganizationSwitcherSkeleton />}>
							<OrganizationSwitcher
								organizationsPromise={getOrganizations({
									sortBy: "name",
									sortOrder: "asc",
								})}
							/>
						</Suspense>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="pt-2">
				<NavMain />
			</SidebarContent>
			<SidebarRail className="bg-muted/10" />
		</Sidebar>
	);
}
