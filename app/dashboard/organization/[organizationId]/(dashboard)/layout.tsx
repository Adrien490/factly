import getOrganizations from "@/app/dashboard/(with-sidebar)/organizations/server/get-organizations";
import hasOrganizationAccess from "@/app/dashboard/(with-sidebar)/organizations/server/has-organization-access";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import OrganizationDashboardSidebar from "./components/organization-dashboard-sidebar";

interface Props {
	children: React.ReactNode;
	params: Promise<{
		organizationId: string;
	}>;
}

export default async function DashboardLayout({ children, params }: Props) {
	const resolvedParams = await params;
	const hasAccess = await hasOrganizationAccess(resolvedParams.organizationId);

	if (!hasAccess) {
		return redirect("/organizations");
	}

	return (
		<SidebarProvider>
			<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
				<OrganizationDashboardSidebar
					organizationsPromise={getOrganizations({
						sortBy: "createdAt",
						sortOrder: "desc",
					})}
					organizationId={resolvedParams.organizationId}
				/>
			</Suspense>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
					</div>
					<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
						<UserAvatar size="sm" />
					</Suspense>
				</header>
				<main className="flex-1 px-4 lg:px-6 py-6 group">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
