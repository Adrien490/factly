import { auth } from "@/domains/auth";
import { getOrganizations, OrganizationSidebar } from "@/domains/organization";
import {
	Separator,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	UserAvatar,
	UserAvatarSkeleton,
} from "@/shared/components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cookies, headers } from "next/headers";
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
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	// Formater la date d'aujourd'hui en français
	const dateToday = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
	// Première lettre en majuscule
	const formattedDate = dateToday.charAt(0).toUpperCase() + dateToday.slice(1);

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Suspense fallback={<div>Loading...</div>}>
				<OrganizationSidebar
					organizationsPromise={getOrganizations({
						sortBy: "name",
						sortOrder: "asc",
					})}
					activeOrganizationId={organizationId}
				/>
			</Suspense>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 bg-card px-4">
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
								user={await auth.api
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
