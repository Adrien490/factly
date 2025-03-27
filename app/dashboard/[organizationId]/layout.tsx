import { auth } from "@/auth";
import { getOrganizations } from "@/features/organization/get-all";
import { OrganizationSidebar } from "@/features/shared/components/organization-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/features/shared/components/ui/breadcrumb";
import { Separator } from "@/features/shared/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/features/shared/components/ui/sidebar";
import { UserAvatar } from "@/features/shared/components/user-avatar";
import { cookies, headers } from "next/headers";
import { Suspense } from "react";
import { UserAvatarSkeleton } from "../(layout)/components/header-skeleton";

type OrganizationLayoutProps = {
	children: React.ReactNode;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function OrganizationLayout({
	children,
	params,
}: OrganizationLayoutProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<Suspense fallback={<div>Loading...</div>}>
				<OrganizationSidebar
					organizationId={organizationId}
					organizationsPromise={getOrganizations({
						sortBy: "name",
						sortOrder: "asc",
					})}
				/>
			</Suspense>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 bg-card px-4">
					<div className="flex items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href={`/dashboard`}>
										Organisations
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Espace de travail</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
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
