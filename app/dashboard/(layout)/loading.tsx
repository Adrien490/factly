import { PageContainer } from "@/features/shared/components/page-container";
import { Button } from "@/features/shared/components/ui/button";
import { Skeleton } from "@/features/shared/components/ui/skeleton";
import { OrganizationListSkeleton } from "./components/organization-list";

export default function DashboardLoading() {
	return (
		<PageContainer className="space-y-6 py-6 group">
			{/* Barre d'outils principale */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center">
				{/* Skeleton pour la barre de recherche */}
				<div className="w-full flex-1 relative flex items-center rounded-md overflow-hidden bg-background border border-input">
					<div className="absolute left-3 flex items-center text-muted-foreground">
						<Skeleton className="h-4 w-4 rounded-full" />
					</div>
					<Skeleton className="h-9 w-full" />
				</div>

				{/* Actions à droite */}
				<div className="flex flex-wrap items-center gap-2 shrink-0">
					{/* Skeleton pour le sélecteur de tri */}
					<div className="flex items-center gap-1">
						<span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block opacity-50">
							Trier par :
						</span>
						<Skeleton className="h-9 w-[120px] rounded-md" />
						<Skeleton className="h-9 w-9 rounded-md" />
					</div>

					{/* Skeleton pour le sélecteur de vue */}
					<Skeleton className="h-9 w-[100px] rounded-md" />

					{/* Bouton "Nouvelle organisation" désactivé pendant le chargement */}
					<Button className="h-9" disabled>
						Nouvelle organisation
					</Button>
				</div>
			</div>

			{/* Liste des organisations en chargement */}
			<OrganizationListSkeleton />
		</PageContainer>
	);
}
