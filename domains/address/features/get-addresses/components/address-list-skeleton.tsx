"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

export function AddressListSkeleton() {
	return (
		<div className="space-y-6">
			{/* Grille d'adresses */}
			<div
				className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"}
			>
				{Array.from({ length: 6 }).map((_, i) => (
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
				))}
			</div>
		</div>
	);
}
