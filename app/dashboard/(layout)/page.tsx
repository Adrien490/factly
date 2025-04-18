import { ORGANIZATION_SORT_FIELDS } from "@/domains/organization/constants";
import {
	getOrganizations,
	OrganizationList,
	OrganizationListSkeleton,
	OrganizationSortableField,
} from "@/domains/organization/features/get-organizations";
import {
	Button,
	PageContainer,
	SearchForm,
	SortingOptionsDropdown,
	ViewToggle,
} from "@/shared/components";

import { ViewType } from "@/shared/types";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	searchParams: Promise<{
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		search?: string;
		view?: ViewType;
	}>;
};

export default async function DashboardPage({ searchParams }: Props) {
	// Récupération des organisations avec les options par défaut
	const resolvedSearchParams = await searchParams;
	const { sortBy, sortOrder, search, view } = resolvedSearchParams;

	console.log(view);

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
					<SortingOptionsDropdown
						sortFields={ORGANIZATION_SORT_FIELDS}
						defaultSortBy="name"
						defaultSortOrder="asc"
					/>

					{/* Sélecteur de vue */}
					<ViewToggle />

					<Link href="/dashboard/new">
						<Button className="h-9">Nouvelle organisation</Button>
					</Link>
				</div>
			</div>

			{/* Liste des organisations */}
			<Suspense fallback={<OrganizationListSkeleton />}>
				<OrganizationList
					viewType={view as ViewType}
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
