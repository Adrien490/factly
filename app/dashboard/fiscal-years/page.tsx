import { getFiscalYearNavigation } from "@/domains/fiscal-year/constants";
import {
	FiscalYearDataTable,
	FiscalYearDataTableSkeleton,
} from "@/domains/fiscal-year/features/get-fiscal-years/components";
import { getFiscalYears } from "@/domains/fiscal-year/features/get-fiscal-years/queries";
import { RefreshFiscalYearsButton } from "@/domains/fiscal-year/features/refresh-fiscal-years";
import {
	Button,
	Calendar,
	HorizontalMenu,
	PageContainer,
	PageHeader,
	SearchForm,
	SortingOptionsDropdown,
	Toolbar,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { FiscalYearStatus } from "@prisma/client";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		// Tri
		sortBy?: string;
		sortOrder?: SortOrder;

		// Recherche
		search?: string;

		// Filtres
		status?: FiscalYearStatus | FiscalYearStatus[];
		isCurrent?: "true" | "false";
	}>;
};

export default async function FiscalYearsPage({ searchParams }: PageProps) {
	const { sortBy, sortOrder, search, status } = await searchParams;

	// Précharger la requête pour les années fiscale

	return (
		<PageContainer className="group pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Années fiscales"
				description="Gérez vos années fiscales"
			/>

			<HorizontalMenu items={getFiscalYearNavigation()} />

			{/* Barre d'actions principale */}
			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher..."
					className="flex-1 shrink-0"
				/>

				<RefreshFiscalYearsButton />

				<SortingOptionsDropdown
					sortFields={[
						{
							value: "startDate",
							label: "Date de début",
							icon: <Calendar />,
						},
						{ value: "name", label: "Nom", icon: <FileX2 /> },
						{
							value: "createdAt",
							label: "Date de création",
							icon: <Calendar />,
						},
					]}
					defaultSortBy="startDate"
					defaultSortOrder="desc"
					className="w-[200px] shrink-0"
				/>

				<Button className="shrink-0" asChild>
					<Link href={`/dashboard/fiscal-years/new`}>
						Nouvelle année fiscale
					</Link>
				</Button>
			</Toolbar>

			{/* Tableau de données avec loading state */}

			<Suspense fallback={<FiscalYearDataTableSkeleton />}>
				<FiscalYearDataTable
					fiscalYearsPromise={getFiscalYears({
						sortBy:
							(sortBy as "startDate" | "name" | "createdAt") || "startDate",
						sortOrder: sortOrder || "desc",
						search: search || undefined,
						status: status as FiscalYearStatus | undefined,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
