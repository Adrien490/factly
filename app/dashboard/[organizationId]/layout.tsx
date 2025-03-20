import { auth } from "@/auth";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import UserAvatar from "@/features/auth/components/user-avatar";
import { UserAvatarSkeleton } from "@/features/auth/components/user-avatar-skeleton";
import getOrganizations from "@/features/organizations/queries/get-organizations";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import OrganizationSidebar from "./components/organization-sidebar";

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

	const hasAccess = await hasOrganizationAccess(organizationId);

	if (!hasAccess) {
		redirect("/dashboard");
	}

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
				<header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
						<Suspense fallback={<UserAvatarSkeleton size="sm" />}>
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
