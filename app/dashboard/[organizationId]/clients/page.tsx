import {
	ClientDataTable,
	ClientDataTableSkeleton,
} from "@/domains/client/components";
import {
	CLIENT_SORT_FIELDS,
	CLIENT_STATUSES,
	CLIENT_TYPES,
} from "@/domains/client/constants";
import { getClients } from "@/domains/client/features/get-clients";
import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	Button,
	FilterSelect,
	MultiSelectFilter,
	PageContainer,
	PageHeader,
	SearchForm,
	SortingOptionsDropdown,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { ClientStatus, ClientType } from "@prisma/client";
import Link from "next/link";
import { forbidden } from "next/navigation";
import { Suspense } from "react";

// Options pour le type de client

type PageProps = {
	searchParams: Promise<{
		// Pagination
		perPage?: string;
		page?: string;
		cursor?: string;

		// Tri
		sortBy?: string;
		sortOrder?: SortOrder;

		// Recherche
		search?: string;

		// Filtres
		status?: ClientStatus | ClientStatus[];
		clientType?: ClientType;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function ClientsPage({ searchParams, params }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const { perPage, page, sortBy, sortOrder, search, status, clientType } =
		resolvedSearchParams;

	if (!hasOrganizationAccess(organizationId)) {
		forbidden();
	}

	// Construire l'objet de filtres
	const filters: Record<string, string | string[]> = {};
	if (status) filters.status = status;
	if (clientType) filters.clientType = clientType;

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
				className="mb-6"
			/>

			{/* Barre de recherche et filtres */}

			{/* Recherche */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4 sm">
				<SearchForm
					paramName="search"
					placeholder="Rechercher par nom, email, référence, SIREN..."
					className="w-full sm:max-w-xs"
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

					{/* Dropdown de tri compact */}
					<SortingOptionsDropdown
						sortFields={CLIENT_SORT_FIELDS}
						defaultSortBy="createdAt"
						defaultSortOrder="desc"
					/>
				</div>
			</div>

			<Suspense fallback={<ClientDataTableSkeleton />}>
				<ClientDataTable
					clientsPromise={getClients({
						organizationId,
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as string,
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}

// Composant de tri combiné compact
