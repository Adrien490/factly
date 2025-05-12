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
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	UserAvatar,
	UserAvatarSkeleton,
} from "@/shared/components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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

	// Formater la date d'aujourd'hui en français
	const dateToday = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
	// Première lettre en majuscule
	const formattedDate = dateToday.charAt(0).toUpperCase() + dateToday.slice(1);

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
										sortBy: "company.name",
										sortOrder: "asc",
									})}
								/>
							</Suspense>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent className="pt-2">
					<NavMain />
				</SidebarContent>
				<SidebarRail className="bg-muted/10" />
			</Sidebar>

			<SidebarInset>
				<header className="flex px-2 lg:px-4 h-16 shrink-0 items-center gap-2 bg-background">
					<div className="flex items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<span className="text-sm text-muted-foreground font-medium">
							{formattedDate}
						</span>
					</div>
					<div className="ml-auto px-4">
						<Suspense fallback={<UserAvatarSkeleton />}>
							<UserAvatar
								userPromise={auth.api
									.getSession({ headers: await headers() })
									.then((session) => session?.user ?? null)}
								size="sm"
							/>
						</Suspense>
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
