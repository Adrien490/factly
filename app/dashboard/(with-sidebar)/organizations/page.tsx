import DataTable from "@/components/datatable";
import { PageContainer } from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { SortingDropdown } from "@/components/sorting-dropdown";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpDown, PlusIcon } from "lucide-react";
import Link from "next/link";
import { columns } from "./components/columns";
import {
	ORGANIZATION_SORT_OPTIONS,
	ORGANIZATION_SORTABLE_FIELDS,
	OrganizationSortableField,
} from "./schemas/get-organizations-schema";
import getOrganizations from "./server/get-organizations";

type PageProps = {
	searchParams: Promise<{
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		search?: string;
	}>;
};

const orderOptions = [
	{ label: "Croissant", value: "asc" },
	{ label: "Décroissant", value: "desc" },
];

export default async function OrganizationsPage({ searchParams }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const { sortBy, sortOrder, search } = resolvedSearchParams;

	// Conversion des paramètres
	const params = {
		sortBy:
			sortBy &&
			ORGANIZATION_SORTABLE_FIELDS.includes(sortBy as OrganizationSortableField)
				? (sortBy as OrganizationSortableField)
				: undefined,
		sortOrder: sortOrder as "asc" | "desc" | undefined,
		search: search,
	};

	// Récupération des données avec les paramètres
	const organizations = await getOrganizations(params);

	return (
		<PageContainer>
			{/* En-tête */}

			<PageHeader
				title="Organisations"
				description="Gérez vos organisations et leurs paramètres"
			/>

			{/* Contenu principal */}
			<div className="flex flex-col gap-6 group">
				{/* Barre d'outils */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col items-start gap-4 lg:flex-row">
						{/* Recherche */}
						<SearchForm
							paramName="search"
							placeholder="Rechercher une organisation..."
							className="w-full lg:w-[280px]"
						/>

						{/* Filtres */}
						<div className="flex items-center gap-2">
							<SortingDropdown
								label="Trier par"
								options={ORGANIZATION_SORT_OPTIONS}
								paramName="sortBy"
								icon={<ArrowUpDown className="h-4 w-4" />}
							/>

							<SortingDropdown
								label="Ordre"
								options={orderOptions}
								paramName="sortOrder"
								icon={<ArrowDownAZ className="h-4 w-4" />}
							/>
						</div>

						{/* Actions */}
						<div className="flex w-full items-center gap-2 lg:w-auto lg:ml-auto">
							<Button
								asChild
								size="sm"
								className="flex-1 whitespace-nowrap lg:flex-initial"
							>
								<Link href="/dashboard/organization/new">
									<PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
									Nouvelle organisation
								</Link>
							</Button>
						</div>
					</div>
				</div>

				<DataTable data={organizations} columns={columns} />
			</div>
		</PageContainer>
	);
}
