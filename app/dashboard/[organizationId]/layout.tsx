import { auth } from "@/domains/auth";
import {
	NavMain,
	OrganizationSwitcher,
	OrganizationSwitcherSkeleton,
} from "@/domains/organization/components";
import {
	getOrganizations,
	hasOrganizationAccess,
} from "@/domains/organization/features";
import {
	Separator,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/shared/components";
import { ThemeToggleSwitch } from "@/shared/components/theme-toggle-switch";
import { UserDropdown } from "@/shared/components/user-dropdown";
import { UserDropdownSkeleton } from "@/shared/components/user-dropdown/user-dropdown-skeleton";
import { OrganizationStatus } from "@prisma/client";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { Suspense } from "react";

interface OrganizationLayoutProps {
	children: React.ReactNode;
	params: Promise<{ organizationId: string }>;
}

export default async function OrganizationLayout({
	children,
	params,
}: OrganizationLayoutProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	const hasAccess = await hasOrganizationAccess(organizationId);

	if (!hasAccess) {
		forbidden();
	}

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader className="border-b border-border/30">
					<SidebarMenu>
						<SidebarMenuItem>
							<Suspense fallback={<OrganizationSwitcherSkeleton />}>
								<OrganizationSwitcher
									organizationId={organizationId}
									organizationsPromise={getOrganizations({
										sortBy: "companyName",
										sortOrder: "asc",
										status: OrganizationStatus.ACTIVE,
									})}
								/>
							</Suspense>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent className="pt-2">
					<NavMain />
				</SidebarContent>

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<ThemeToggleSwitch />
						</SidebarMenuItem>
						<SidebarMenuItem className="border-t border-border/30 pt-1">
							<Suspense fallback={<UserDropdownSkeleton />}>
								<UserDropdown
									userPromise={auth.api
										.getSession({ headers: await headers() })
										.then((session) => session?.user ?? null)}
								/>
							</Suspense>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>

				<SidebarRail className="bg-muted/10" />
			</Sidebar>

			<SidebarInset>
				<header className="flex px-2 lg:px-4 h-16 shrink-0 items-center gap-2 bg-background">
					<div className="flex items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
