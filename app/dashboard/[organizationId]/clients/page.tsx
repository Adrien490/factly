import {
	CLIENT_STATUSES,
	CLIENT_TYPES,
	clientColumns,
	ClientSortableField,
	getClients,
} from "@/domains/client";
import { hasOrganizationAccess } from "@/domains/organization";
import {
	DataTable,
	FilterSelect,
	MultiSelectFilter,
	PageContainer,
	PageHeader,
	SearchForm,
} from "@/shared/components";
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

			{/* Recherche */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
				<SearchForm
					paramName="search"
					placeholder="Rechercher par nom, email, référence, SIREN..."
					className="w-full flex-1 max-w-sm"
				/>
				<span className="text-xs font-medium text-muted-foreground px-1">
					Filtrer par:
				</span>
				<div className="flex flex-wrap gap-2">
					<MultiSelectFilter
						filterKey="status"
						label="Statut"
						options={CLIENT_STATUSES}
					/>
					<FilterSelect
						filterKey="clientType"
						label="Type"
						options={CLIENT_TYPES}
					/>
				</div>
			</div>

			<Card>
				<DataTable
					data={clients}
					columns={clientColumns}
					pagination={pagination}
					selection={{ key: "clientId" }}
				/>
			</Card>
		</PageContainer>
	);
}
