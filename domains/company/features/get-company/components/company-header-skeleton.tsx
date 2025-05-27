import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function CompanyHeaderSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="max-w-[240px] cursor-default hover:bg-transparent"
				>
					<Skeleton className="flex aspect-square size-8 rounded-lg shrink-0" />
					<div className="grid flex-1 text-left text-sm leading-tight min-w-0 gap-1">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-20" />
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
