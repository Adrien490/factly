import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function UserDropdownSkeleton() {
	return (
		<SidebarMenuButton
			size="lg"
			className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10">
				<Skeleton className="size-full rounded-lg" />
			</div>
			<div className="grid flex-1 gap-1 text-left text-sm leading-tight">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-3 w-32" />
			</div>
			<Skeleton className="ml-auto size-4 shrink-0" />
		</SidebarMenuButton>
	);
}
