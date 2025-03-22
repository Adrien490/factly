"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function OrganizationListSkeleton() {
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
					<OrganizationCardSkeleton key={i} viewMode="grid" />
				))}
			</div>
		</div>
	);
}

// Skeleton pour une carte individuelle
export function OrganizationCardSkeleton({
	viewMode = "grid",
}: {
	viewMode?: "grid" | "list";
}) {
	// Rendu en mode liste
	if (viewMode === "list") {
		return (
			<div className="border rounded-lg p-3">
				<div className="flex gap-3 items-center">
					{/* Logo placeholder */}
					<Skeleton className="h-10 w-10 rounded-md shrink-0" />

					{/* Contenu simplifié */}
					<div className="flex-1">
						<Skeleton className="h-5 w-[60%] mb-2" />
						<Skeleton className="h-3 w-[40%]" />
					</div>

					{/* Menu d'actions placeholder */}
					<Skeleton className="h-6 w-6 rounded-md shrink-0" />
				</div>
			</div>
		);
	}

	// Rendu en mode grille
	return (
		<Card className="h-full">
			<CardContent className="p-4 flex flex-col h-full">
				<div className="flex items-start gap-3">
					{/* Logo placeholder */}
					<Skeleton className="h-12 w-12 rounded-md shrink-0" />

					{/* Titre et sous-titre */}
					<div className="flex-1">
						<Skeleton className="h-5 w-[70%] mb-2" />
						<Skeleton className="h-3 w-[40%]" />
					</div>

					{/* Menu d'actions placeholder */}
					<Skeleton className="h-6 w-6 rounded-md shrink-0" />
				</div>

				{/* Pied de carte simplifié */}
				<div className="pt-3 mt-2 space-y-2">
					<Skeleton className="h-3 w-[60%]" />
					<Skeleton className="h-3 w-[40%]" />
				</div>
			</CardContent>
		</Card>
	);
}
