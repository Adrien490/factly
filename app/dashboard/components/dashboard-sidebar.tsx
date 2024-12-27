"use client";

import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Home, Package, Receipt, Truck, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

const navigation = {
	navMain: [
		{
			title: "Menu principal",
			url: "/dashboard",
			items: [
				{
					title: "Dashboard",
					url: "/dashboard",
					icon: Home,
				},
				{
					title: "Clients",
					url: "/dashboard/clients",
					icon: Users,
				},
				{
					title: "Suppliers",
					url: "/dashboard/suppliers",
					icon: Truck,
				},
				{
					title: "Products",
					url: "/dashboard/products",
					icon: Package,
				},
				{
					title: "Invoices",
					url: "/dashboard/invoices",
					icon: Receipt,
				},
			],
		},
	],
};

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				{navigation.navMain.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>
							<span className="flex items-center gap-2">{group.title}</span>
						</SidebarGroupLabel>
						<Separator className="my-2" />
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items?.map((item) => {
									const Icon = item.icon;
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={pathname === item.url}
											>
												<a href={item.url} className="flex items-center gap-2">
													<Icon className="h-4 w-4" />
													{item.title}
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
