"use client";

import { Building2, Trash2, Users } from "lucide-react";
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
	icon: React.ReactNode;
	path: string;
	variant?: "default" | "destructive";
}

function getSettingsMenu(organizationId: string): MenuItem[] {
	return [
		{
			title: "Général",
			icon: <Building2 className="size-4" />,
			path: `/dashboard/organization/${organizationId}/settings`,
		},
		{
			title: "Gestion des membres",
			icon: <Users className="size-4" />,
			path: `/dashboard/organization/${organizationId}/settings/members`,
		},
		{
			title: "Supprimer l'organisation",
			icon: <Trash2 className="size-4" />,
			path: `/dashboard/organization/${organizationId}/settings/delete`,
			variant: "destructive",
		},
	];
}

export default function OrganizationSettingsSidebar({
	organizationId,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	organizationId: string;
}) {
	const pathname = usePathname();
	const settingsMenu = getSettingsMenu(organizationId);

	return (
		<Sidebar
			{...props}
			className="h-[calc(100vh-4rem)] border-r md:sticky"
			collapsible="offcanvas"
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
						Configuration
					</SidebarGroupLabel>
					<SidebarMenu className="space-y-1 px-2">
						{settingsMenu.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									className={cn(
										"",
										item.variant === "destructive" &&
											"text-destructive hover:text-destructive",
										pathname === item.path && "bg-accent text-accent-foreground"
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
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
