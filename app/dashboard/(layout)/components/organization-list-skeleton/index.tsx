"use client";

import { OrganizationCardSkeleton } from "@/app/dashboard/(layout)/components/organization-card-skeleton";
import { ViewType } from "@/shared/components/toggle-view/types";

type OrganizationListSkeletonProps = {
	viewType?: ViewType;
};

export default function OrganizationListSkeleton({
	viewType = "grid",
}: OrganizationListSkeletonProps) {
	return (
		<div className="space-y-6">
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
