import { OrganizationSwitcher } from "@/domains/organization/components/organization-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/shared/components/ui/sidebar";
import { use } from "react";
import { NavMain } from "./components/nav-main/nav-main";
import { OrganizationSidebarProps } from "./types";

export function OrganizationSidebar({
	organizationsPromise,
	...props
}: OrganizationSidebarProps) {
	const organizations = use(organizationsPromise);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="border-b border-border/30">
				<SidebarMenu>
					<SidebarMenuItem>
						<OrganizationSwitcher organizations={organizations} />
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
