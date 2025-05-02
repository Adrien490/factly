"use client";

import { SidebarMenuButton, useSidebar } from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils";

export function OrganizationSwitcherSkeleton() {
	const { state: sidebarState } = useSidebar();
	const isCollapsed = sidebarState === "collapsed";

	return (
		<SidebarMenuButton
			size={isCollapsed ? "default" : "lg"}
			className={cn(
				"relative overflow-hidden my-2",
				!isCollapsed &&
					"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			)}
		>
			{isCollapsed ? (
				// Mode collapsed - structure simplifiée
				<Skeleton className="absolute inset-0" />
			) : (
				// Mode normal - avec informations
				<>
					<Skeleton className="size-8 rounded-lg" />
					<div className="flex flex-col gap-0.5 min-w-0 flex-1">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-24" />
					</div>
					<Skeleton className="ml-2 size-4 shrink-0" />
				</>
			)}
		</SidebarMenuButton>
	);
}
