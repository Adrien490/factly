import { GetCompanyReturn } from "@/domains/company/features/get-company";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
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
				<SidebarMenuButton size="lg" className="max-w-[240px]">
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
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
