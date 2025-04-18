"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import { SpinnerLoader } from "@/shared/components/loaders/spinner-loader";
import {
	SidebarMenuButton,
	useSidebar,
} from "@/shared/components/shadcn-ui/sidebar";
import { cn } from "@/shared/utils";
import {
	Check,
	ChevronsUpDown,
	GalleryVerticalEnd,
	Loader2,
	LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { GetOrganizationsReturn } from "../../features/get-organizations";

interface OrganizationSwitcherProps {
	organizations: GetOrganizationsReturn;
}

export function OrganizationSwitcher({
	organizations,
}: OrganizationSwitcherProps) {
	const params = useParams();
	const organizationId = params.organizationId;
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";

	const currentOrganization = organizations.find(
		(organization) => organization.id === organizationId
	);

	const handleSelectOrganization = (organizationId: string) => {
		startTransition(() => {
			router.push(`/dashboard/${organizationId}`);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{isCollapsed ? (
					// Mode collapsed - structure simplifiée
					<SidebarMenuButton
						size="default"
						className="relative overflow-hidden my-2"
					>
						{isPending ? (
							<SpinnerLoader size="sm" color="primary" />
						) : currentOrganization?.logoUrl ? (
							<div className="absolute inset-0">
								<Image
									src={currentOrganization.logoUrl}
									alt={currentOrganization.name}
									fill
									sizes="32px"
									className="object-cover"
									priority
								/>
							</div>
						) : (
							<div className="absolute inset-0 flex items-center justify-center bg-sidebar-primary/10 transition-none">
								<GalleryVerticalEnd className="size-4" />
							</div>
						)}
					</SidebarMenuButton>
				) : (
					// Mode normal - avec informations
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="rounded-lg bg-sidebar-primary/10 text-sidebar-primary size-8 flex items-center justify-center overflow-hidden transition-none">
							{isPending ? (
								<Loader2 className="size-4 animate-spin transition-none" />
							) : currentOrganization?.logoUrl ? (
								<Image
									src={currentOrganization.logoUrl}
									alt={currentOrganization.name}
									width={32}
									height={32}
									className="object-cover w-full h-full transition-none"
								/>
							) : (
								<GalleryVerticalEnd className="size-4 transition-none" />
							)}
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
				)}
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-60 max-h-[300px] overflow-y-auto"
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
						<div className="size-6 rounded-md flex items-center justify-center overflow-hidden border transition-none">
							{organization.logoUrl ? (
								<Image
									src={organization.logoUrl}
									alt={organization.name}
									width={24}
									height={24}
									className="object-cover w-full h-full transition-none"
								/>
							) : (
								<div className="size-2 rounded-full bg-primary/10 transition-none" />
							)}
						</div>
						<span className="flex-1 truncate">{organization.name}</span>
						{organization.id === organizationId && (
							<Check className="ml-2 size-4 shrink-0" />
						)}
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />
				<DropdownMenuItem asChild className="text-muted-foreground">
					<Link href="/dashboard" className="flex items-center gap-2">
						<LogOut className="size-4" />
						<span>Quitter le tableau de bord</span>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
