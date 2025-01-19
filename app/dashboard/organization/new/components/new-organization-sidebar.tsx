"use client";

import { ArrowLeft, Building2 } from "lucide-react";
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
}

function getSettingsMenu(): MenuItem[] {
	return [
		{
			title: "Retour",
			icon: <ArrowLeft className="size-4" />,
			path: `/dashboard/organizations`,
		},
		{
			title: "Formulaire de création",
			icon: <Building2 className="size-4" />,
			path: `/dashboard/organizations/new`,
		},
	];
}

export function NewOrganizationSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const settingsMenu = getSettingsMenu();

	return (
		<Sidebar
			{...props}
			className="h-[calc(100vh-4rem)] border-r md:sticky md:top-16"
			collapsible="offcanvas"
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
						Créer une organisation
					</SidebarGroupLabel>
					<SidebarMenu className="space-y-1 px-2">
						{settingsMenu.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									className={cn(
										"",
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
