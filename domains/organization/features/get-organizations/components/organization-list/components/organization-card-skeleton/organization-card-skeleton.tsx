import { Card, CardContent } from "@/shared/components/";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { ViewType } from "@/shared/types";

export function OrganizationCardSkeleton({
	viewType = "grid",
}: {
	viewType?: ViewType;
}) {
	// Rendu en mode liste
	if (viewType === "list") {
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
