"use client";

import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Skeleton } from "@/features/shared/components/ui/skeleton";
import { ViewType } from "@/features/shared/types";

type AddressCardSkeletonProps = {
	viewMode?: ViewType;
};

export function AddressCardSkeleton({
	viewMode = "grid",
}: AddressCardSkeletonProps) {
	// Rendu en mode liste
	if (viewMode === "list") {
		return (
			<div className="border rounded-lg p-3">
				<div className="flex items-center gap-3">
					{/* Icône adresse */}
					<Skeleton className="h-10 w-10 rounded-md" />

					{/* Adresse et détails */}
					<div className="min-w-0 flex-1">
						<Skeleton className="h-5 w-3/4 mb-2" />
						<Skeleton className="h-3 w-1/2" />
					</div>

					{/* Menu d'actions */}
					<Skeleton className="h-8 w-8 rounded-full" />
				</div>
			</div>
		);
	}

	// Rendu en mode grille
	return (
		<Card className="h-full">
			<CardContent className="p-4 flex flex-col h-full">
				<div className="flex items-start gap-3">
					{/* Icône de l'adresse */}
					<Skeleton className="h-12 w-12 rounded-md" />

					{/* Adresse principale */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<Skeleton className="h-5 w-3/4 mb-2" />
						</div>
						<Skeleton className="h-3 w-1/2" />
					</div>

					{/* Menu d'actions */}
					<Skeleton className="h-8 w-8 rounded-full" />
				</div>

				{/* Informations secondaires */}
				<div className="pt-3 flex gap-2 mt-2">
					<Skeleton className="h-3 w-1/3" />
					<Skeleton className="h-3 w-1/4" />
				</div>
			</CardContent>
		</Card>
	);
}
