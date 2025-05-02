"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/utils";
import {
	Check,
	ChevronsUpDown,
	GalleryVerticalEnd,
	LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { GetOrganizationsReturn } from "../features/get-organizations";

interface OrganizationSwitcherProps {
	organizationsPromise: Promise<GetOrganizationsReturn>;
	organizationId: string;
}

export function OrganizationSwitcher({
	organizationsPromise,
	organizationId,
}: OrganizationSwitcherProps) {
	const organizations = use(organizationsPromise);
	const { isMobile } = useSidebar();

	const currentOrganization = organizations.find(
		(organization) => organization.id === organizationId
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
								{currentOrganization?.logoUrl ? (
									<Image
										src={currentOrganization.logoUrl}
										alt={currentOrganization.name}
										width={32}
										height={32}
										className="object-cover w-full h-full"
									/>
								) : (
									<GalleryVerticalEnd className="size-4" />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{currentOrganization?.name || "Sélectionner une organisation"}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									Changer d&apos;organisation
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Vos organisations
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{organizations.map((organization) => (
							<DropdownMenuItem
								key={organization.id}
								className={cn(
									"gap-2 p-2",
									organization.id === organizationId && "font-medium"
								)}
							>
								<div className="flex size-6 items-center justify-center rounded-sm border">
									{organization.logoUrl ? (
										<Image
											src={organization.logoUrl}
											alt={organization.name}
											width={24}
											height={24}
											className="object-cover w-full h-full"
										/>
									) : (
										<div className="size-2 rounded-full bg-primary/10" />
									)}
								</div>
								<span className="flex-1 truncate">{organization.name}</span>
								{organization.id === organizationId && (
									<Check className="ml-2 size-4 shrink-0" />
								)}
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator />
						<DropdownMenuItem
							asChild
							className="gap-2 p-2 text-muted-foreground"
						>
							<Link href="/dashboard" className="flex items-center">
								<LogOut className="size-4" />
								<span>Quitter le tableau de bord</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
