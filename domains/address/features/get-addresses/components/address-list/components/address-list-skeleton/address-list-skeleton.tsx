"use client";

import { Card, CardContent } from "@/shared/components/";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { AddressListSkeletonProps } from "./types";

export function AddressListSkeleton({
	viewType = "grid",
}: AddressListSkeletonProps) {
	return (
		<div className="space-y-6">
			{/* Grille d'adresses */}
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
								{/* Icône placeholder */}
								<Skeleton className="h-10 w-10 rounded-md shrink-0" />

								{/* Contenu d'adresse */}
								<div className="flex-1">
									{/* Ligne principale avec badges */}
									<div className="flex items-center gap-2 mb-2">
										<Skeleton className="h-5 w-[40%]" />
										<Skeleton className="h-4 w-[15%] rounded-full" />
										<Skeleton className="h-4 w-[20%] rounded-full" />
									</div>
									{/* Ligne secondaire (ville, code postal, etc.) */}
									<Skeleton className="h-3 w-[60%]" />
								</div>

								{/* Menu d'actions placeholder */}
								<Skeleton className="h-6 w-6 rounded-md shrink-0" />
							</div>
						</div>
					) : (
						// Mode grille - card
						<Card key={i} className="h-full">
							<CardContent className="p-4 flex flex-col h-full">
								<div className="flex items-start gap-3">
									{/* Icône placeholder */}
									<Skeleton className="h-12 w-12 rounded-md shrink-0" />

									{/* Adresse principale et indicateurs */}
									<div className="flex-1">
										{/* Ligne principale avec badge "par défaut" */}
										<div className="flex flex-wrap items-center gap-2 mb-2">
											<Skeleton className="h-5 w-[50%]" />
											<Skeleton className="h-4 w-[25%] rounded-full" />
										</div>
										{/* Ligne complémentaire */}
										<Skeleton className="h-4 w-[70%]" />
									</div>

									{/* Menu d'actions placeholder */}
									<Skeleton className="h-6 w-6 rounded-md shrink-0" />
								</div>

								{/* Informations secondaires */}
								<div className="pt-3 mt-2 flex flex-wrap gap-2">
									{/* Type d'adresse */}
									<Skeleton className="h-4 w-[25%] rounded-full" />
									{/* Ville et code postal */}
									<Skeleton className="h-4 w-[40%]" />
									{/* Pays (optionnel) */}
									<Skeleton className="h-4 w-[20%]" />
								</div>
							</CardContent>
						</Card>
					)
				)}
			</div>
		</div>
	);
}
