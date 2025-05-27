import { GetCompanyReturn } from "@/domains/company/features/get-company";
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
} from "@/shared/components/ui/sidebar";
import { ChevronsUpDown, GalleryVerticalEnd, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

interface CompanyHeaderProps {
	companyPromise: Promise<GetCompanyReturn>;
}

export function CompanyHeader({ companyPromise }: CompanyHeaderProps) {
	const company = use(companyPromise);

	if (!company) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground max-w-[240px]"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary shrink-0">
								{company.logoUrl ? (
									<Image
										src={company.logoUrl}
										alt={company.name}
										width={32}
										height={32}
										className="object-cover w-full h-full rounded-lg"
									/>
								) : (
									<GalleryVerticalEnd className="size-4" />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight min-w-0">
								<span className="truncate font-semibold">{company.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									Votre entreprise
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-60 min-w-56 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							{company.name}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuItem asChild className="gap-2 p-2">
							<Link href="/" className="flex items-center">
								<div className="flex size-6 items-center justify-center rounded-sm border">
									<Home className="size-3" />
								</div>
								<span className="flex-1">Retour à l&apos;accueil</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
