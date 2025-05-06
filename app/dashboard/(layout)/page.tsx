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
import { Calendar, Users } from "lucide-react";
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
	const { sortBy, sortOrder, search, view } = await searchParams;

	return (
		<PageContainer className="space-y-6 py-6 group">
			{/* Barre d'outils principale */}
			<Toolbar className="">
				<SearchForm
					paramName="search"
					placeholder="Rechercher une organisation..."
					className="w-full flex-1"
				/>

				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Nom",
							value: "name",
							icon: <Users className="h-4 w-4" />,
						},
						{
							label: "Date de création",
							value: "createdAt",
							icon: <Calendar className="h-4 w-4" />,
						},
					]}
					defaultSortBy="name"
					defaultSortOrder="asc"
				/>

				{/* Sélecteur de vue */}
				<ViewToggle />

				<Link href="/dashboard/new">
					<Button className="h-9">Nouvelle organisation</Button>
				</Link>
			</Toolbar>

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
