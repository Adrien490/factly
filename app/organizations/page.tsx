import DataTable from "@/components/datatable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import PageHeader from "../../components/page-header";
import SearchForm from "../../components/search-form";
import getOrganizations from "./api/get-organizations";
import { columns } from "./components/columns";

type PageProps = {
	searchParams: Promise<{
		page?: string;
		perPage?: string;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		search?: string;
	}>;
};

const validSortFields = ["createdAt", "name", "siren", "vatNumber"] as const;
type SortField = (typeof validSortFields)[number];

export default async function OrganizationsPage({ searchParams }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const { page, perPage, sortBy, sortOrder, search } = resolvedSearchParams;

	// Conversion des paramètres
	const params = {
		page: Number(page) || 1,
		perPage: Number(perPage) || 10,
		sortBy: validSortFields.includes(sortBy as SortField)
			? (sortBy as SortField)
			: "createdAt",
		sortOrder: sortOrder as "asc" | "desc",
		search: search,
		filters: {},
	};

	// Récupération des données avec les paramètres
	const organizations = await getOrganizations(params);

	return (
		<div className="space-y-4">
			<PageHeader
				title="Organisations"
				description="Gérez vos organisations et leurs paramètres"
			/>

			{/* Barre d'outils supérieure */}
			<div className="flex flex-col gap-4">
				<div className="bg-muted/50 p-4 rounded-lg">
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						{/* Recherche */}
						<div className="flex flex-col sm:flex-row items-center gap-4">
							<SearchForm
								paramName="search"
								placeholder="Rechercher une organisation..."
								className="w-full sm:w-[300px]"
							/>
						</div>

						{/* Actions groupées */}
						<div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
							<Link
								href="/organizations/new"
								className="flex-1 sm:flex-none min-w-[40px] sm:min-w-0"
							>
								<Button size="sm" className="w-full">
									<PlusIcon className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">
										Nouvelle organisation
									</span>
									<span className="inline sm:hidden">Ajouter</span>
								</Button>
							</Link>
						</div>
					</div>
				</div>

				{/* Table */}
				<DataTable data={organizations || []} columns={columns} />
			</div>
		</div>
	);
}
