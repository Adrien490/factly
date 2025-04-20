"use client";

import { Card, CardContent } from "@/shared/components/";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { OrganizationListSkeletonProps } from "./types";

export function OrganizationListSkeleton({
	viewType = "grid",
}: OrganizationListSkeletonProps) {
	return (
		<div className="space-y-6">
			{/* Grille d'organisations */}
			<div
				className={
					viewType === "grid"
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
						: "space-y-3 mt-4"
				}
			>
				{Array.from({ length: 6 }).map((_, i) =>
					viewType === "list" ? (
						// Mode liste - inline
						<div key={i} className="border rounded-lg p-3">
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
					) : (
						// Mode grille - inline
						<Card key={i} className="h-full p-4">
							<CardContent className="flex flex-col h-full">
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
					)
				)}
			</div>
		</div>
	);
}
