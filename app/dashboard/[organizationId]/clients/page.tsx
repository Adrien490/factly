import { columns } from "@/app/dashboard/[organizationId]/clients/components/columns";
import { getClients } from "@/features/client";
import { CLIENT_STATUS_OPTIONS } from "@/features/client/client-status-options";
import { CLIENT_TYPE_OPTIONS } from "@/features/client/client-type-options";
import { ClientSortableField } from "@/features/client/get-all/constants/client-sortable-fields";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import { DataTable } from "@/shared/components/datatable";
import { FilterSelect } from "@/shared/components/filter-select";
import { MultiSelectFilter } from "@/shared/components/multi-select-filter";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { SearchForm } from "@/shared/components/search-form";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { SortOrder } from "@/shared/types";
import Link from "next/link";
import { forbidden } from "next/navigation";

// Options pour le type de client

type PageProps = {
	searchParams: Promise<{
		perPage?: string;
		cursor?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		[key: string]: string | undefined;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function ClientsPage({ searchParams, params }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const { perPage, page, sortBy, sortOrder, search, ...filters } =
		resolvedSearchParams;

	if (!hasOrganizationAccess(organizationId)) {
		forbidden();
	}

	const { clients, pagination } = await getClients({
		organizationId,
		perPage: Number(perPage) || 10,
		page: Number(page) || 1,
		sortBy: sortBy as ClientSortableField,
		sortOrder: sortOrder as SortOrder,
		search,
		filters: Object.entries(filters).reduce((acc, [key, value]) => {
			if (value) {
				acc[key] = value;
			}
			return acc;
		}, {} as Record<string, string>),
	});

	return (
		<PageContainer className="pb-12 group">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Clients"
				description="Gérez votre portefeuille clients"
				action={
					<Button asChild size="default">
						<Link href={`/dashboard/${organizationId}/clients/new`}>
							Nouveau client
						</Link>
					</Button>
				}
				navigation={{
					items: [
						{
							label: "Liste des clients",
							href: `/dashboard/${organizationId}/clients`,
						},
						{
							label: "Nouveau client",
							href: `/dashboard/${organizationId}/clients/new`,
						},
					],
				}}
				className="mb-6"
			/>

			{/* Barre de recherche et filtres */}
			<Card className="mb-4 py-4 space-y-4">
				{/* Recherche */}
				<div className="px-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
					<SearchForm
						paramName="search"
						placeholder="Rechercher par nom, email, référence, SIREN..."
						className="w-full flex-1 max-w-md"
					/>
					<span className="text-xs font-medium text-muted-foreground px-1">
						Filtrer par:
					</span>
					<div className="flex flex-wrap gap-2">
						<MultiSelectFilter
							filterKey="status"
							label="Statut"
							options={CLIENT_STATUS_OPTIONS}
						/>
						<FilterSelect
							filterKey="clientType"
							label="Type"
							options={CLIENT_TYPE_OPTIONS}
						/>
					</div>
				</div>
			</Card>

			<Card>
				<DataTable
					data={clients}
					columns={columns}
					pagination={pagination}
					selection={{ key: "clientId" }}
				/>
			</Card>
		</PageContainer>
	);
}
