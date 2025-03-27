"use client";

import { type GetOrganizationsReturn } from "@/features/organization/get-all";
import { EmptyState } from "@/features/shared/components/empty-state/components/empty-state";
import { ViewType } from "@/features/shared/types";
import { Building2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import { OrganizationCard } from "../../organization-card";

type OrganizationListProps = {
	organizationsPromise: Promise<GetOrganizationsReturn>;
};

export function OrganizationList({
	organizationsPromise,
}: OrganizationListProps) {
	// Utilisation du hook use pour résoudre la Promise
	const organizations = use(organizationsPromise);
	const searchParams = useSearchParams();
	const viewMode = (searchParams.get("view") as ViewType) || "grid";

	// Affichage de l'état vide (pas d'organisations)
	if (organizations.length === 0) {
		return (
			<EmptyState
				icon={Building2}
				title="Aucune organisation trouvée"
				description="Créez une organisation pour commencer"
			/>
		);
	}

	// Container adaptatif selon le mode de vue
	const containerClassName =
		viewMode === "grid"
			? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
			: "space-y-3";

	return (
		<div className="relative group-has-data-pending:animate-pulse">
			{/* Animation de transition pour donner un retour visuel lorsqu'on change de vue */}
			<div className={`transition-all duration-300 ${containerClassName}`}>
				{/* Mapping des organisations avec le paramètre view pour adaptation */}
				{organizations.map((organization) => (
					<OrganizationCard
						key={organization.id}
						organization={organization}
						viewMode={viewMode}
					/>
				))}

				{organizations.length === 0 && (
					<Link
						href="/dashboard/new"
						className={`block ${viewMode === "grid" ? "h-full" : ""}`}
					>
						<div
							className={`
						border border-dashed rounded-lg flex items-center justify-center 
						text-muted-foreground hover:text-primary hover:border-primary 
						transition-colors
						${viewMode === "grid" ? "h-full p-6 flex-col" : "p-4 flex-row"}
					`}
						>
							<PlusCircle
								className={
									viewMode === "grid" ? "h-10 w-10 mb-2" : "h-5 w-5 mr-2"
								}
							/>
							<span>
								{viewMode === "grid"
									? "Créer une organisation"
									: "Nouvelle organisation"}
							</span>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
}
