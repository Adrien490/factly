"use client";

import { OrganizationCardSkeleton } from "@/app/dashboard/(layout)/components/organization-card-skeleton";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ViewType } from "@/shared/types";

type OrganizationListSkeletonProps = {
	viewType?: ViewType;
};

export default function OrganizationListSkeleton({
	viewType = "grid",
}: OrganizationListSkeletonProps) {
	return (
		<div className="space-y-6">
			{/* En-tête avec zone de recherche et boutons */}
			<div className="flex justify-between items-center">
				<Skeleton className="h-9 w-[300px]" />
				<div className="flex gap-2">
					<Skeleton className="h-9 w-[120px]" />
					<Skeleton className="h-9 w-[170px]" />
				</div>
			</div>

			{/* Grille d'organisations */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<OrganizationCardSkeleton key={i} viewType={viewType} />
				))}
			</div>
		</div>
	);
}

// Skeleton pour une carte individuelle
