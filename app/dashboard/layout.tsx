import { auth } from "@/auth";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { UserAvatar } from "./components/user-avatar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
					</div>
					<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
						<UserAvatar size="sm" sessionPromise={auth()} />
					</Suspense>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 break-all">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
