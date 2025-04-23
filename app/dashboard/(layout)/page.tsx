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
	Toolbar,
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

	return (
		<PageContainer className="space-y-6 py-6 group">
			{/* Barre d'outils principale */}
			<Toolbar
				leftContent={
					<>
						{/* Recherche à gauche prenant toute la place disponible */}
						<SearchForm
							paramName="search"
							placeholder="Rechercher une organisation..."
							className="w-full flex-1"
						/>
					</>
				}
				rightContent={
					<>
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
					</>
				}
			/>

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
