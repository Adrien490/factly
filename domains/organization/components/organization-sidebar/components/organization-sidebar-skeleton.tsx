import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/shared/components/shadcn-ui/sidebar";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";

/**
 * Composant skeleton pour la barre latérale d'organisation
 * Affiche une version chargement de OrganizationSidebar
 */
export function OrganizationSidebarSkeleton({ ...props }) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="border-b border-border/30">
				<SidebarMenu>
					<SidebarMenuItem>
						{/* Skeleton du switcher d'organisation */}
						<div className="flex items-center gap-3 py-2 px-3">
							<Skeleton className="h-8 w-8 rounded-lg" />
							<div className="flex flex-col gap-1 flex-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-32" />
							</div>
							<Skeleton className="h-4 w-4 rounded-full" />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="pt-2">
				{/* Skeleton du menu principal */}
				<div className="space-y-2 px-3">
					{/* Label du groupe */}
					<Skeleton className="h-4 w-32 my-2" />

					{/* Items du menu principal */}
					<div className="space-y-1">
						{[...Array(3)].map((_, index) => (
							<div key={index} className="py-2">
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-2">
										<Skeleton className="h-4 w-4 rounded" />
										<Skeleton className="h-4 w-24" />
									</div>
								</div>
							</div>
						))}

						{/* Item du menu avec sous-items */}
						<div>
							<div className="py-2">
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-2">
										<Skeleton className="h-4 w-4 rounded" />
										<Skeleton className="h-4 w-24" />
									</div>
									<Skeleton className="h-4 w-4 rounded" />
								</div>
							</div>
							{/* Sous-items */}
							<div className="pl-6 space-y-1 pt-1">
								{[...Array(2)].map((_, index) => (
									<div key={index} className="py-1.5">
										<Skeleton className="h-3.5 w-20" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</SidebarContent>
			<SidebarRail className="bg-muted/10" />
		</Sidebar>
	);
}
