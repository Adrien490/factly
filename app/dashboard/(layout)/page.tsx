import PageContainer from "@/components/page-container";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import {
	ORGANIZATION_SORT_OPTIONS,
	OrganizationSortableField,
} from "@/features/organizations/lib/organization-sortable-fields";
import getOrganizations from "@/features/organizations/queries/get-organizations";
import ViewSwitcher from "@/features/toggle-view";
import Link from "next/link";
import { Suspense } from "react";
import SortSelector from "../../../features/sorting/components/sort-selector";
import OrganizationList from "./components/organization-list";
import OrganizationListSkeleton from "./components/organization-list-skeleton";

type Props = {
	searchParams: Promise<{
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		search?: string;
	}>;
};

export default async function DashboardPage({ searchParams }: Props) {
	// Récupération des organisations avec les options par défaut
	const resolvedSearchParams = await searchParams;
	const { sortBy, sortOrder, search } = resolvedSearchParams;

	return (
		<PageContainer className="space-y-6 py-6 group">
			{/* Barre d'outils principale */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center">
				{/* Recherche à gauche prenant toute la place disponible */}
				<SearchForm
					paramName="search"
					placeholder="Rechercher une organisation..."
					className="w-full flex-1"
				/>

				{/* Actions à droite */}
				<div className="flex flex-wrap items-center gap-2 shrink-0">
					{/* Sélecteur de tri */}
					<SortSelector
						options={ORGANIZATION_SORT_OPTIONS}
						defaultValue="name"
						defaultOrder="asc"
					/>

					{/* Sélecteur de vue */}
					<ViewSwitcher />

					<Link href="/dashboard/new">
						<Button className="h-9">Nouvelle organisation</Button>
					</Link>
				</div>
			</div>

			{/* Liste des organisations */}
			<Suspense fallback={<OrganizationListSkeleton />}>
				<OrganizationList
					organizationsPromise={getOrganizations({
						sortBy: sortBy as OrganizationSortableField,
						sortOrder: sortOrder as "asc" | "desc",
						search,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
