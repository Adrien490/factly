"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function OrganizationSwitcher({
	organizations,
}: {
	organizations: Organization[];
}) {
	const params = useParams();
	const organizationId = params.organizationId;
	const router = useRouter();

	const currentOrganization = organizations.find(
		(organization) => organization.id === organizationId
	);

	const handleSelectOrganization = (organizationId: string) => {
		if (organizationId === organizationId) {
			router.push(`/dashboard/${organizationId}`);
		}
	};

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
								<GalleryVerticalEnd className="size-4" />
							</div>
							<div className="flex flex-col gap-0.5 min-w-0 flex-1">
								<span className="font-medium truncate">
									{currentOrganization?.name || "Sélectionner une organisation"}
								</span>
								<span className="text-xs text-muted-foreground truncate">
									Changer d&apos;organisation
								</span>
							</div>
							<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] max-h-[300px] overflow-y-auto"
						align="start"
					>
						<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
							Vos organisations
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{organizations.map((organization) => (
							<DropdownMenuItem
								key={organization.id}
								onSelect={() => handleSelectOrganization(organization.id)}
								className={cn(
									"flex items-center gap-2",
									organization.id === organizationId && "font-medium"
								)}
							>
								<div className="size-2 rounded-full bg-primary/10" />
								<span className="flex-1 truncate">{organization.name}</span>
								{organization.id === organizationId && (
									<Check className="ml-2 size-4 shrink-0" />
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
