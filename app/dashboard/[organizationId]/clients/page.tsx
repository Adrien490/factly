import {
	ClientDataTable,
	ClientDataTableSkeleton,
} from "@/domains/client/components";
import { CLIENT_SORT_FIELDS } from "@/domains/client/constants";
import { RefreshClientsButton } from "@/domains/client/features";
import { getClients } from "@/domains/client/features/get-clients";
import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	Button,
	PageContainer,
	PageHeader,
	SearchForm,
	SortingOptionsDropdown,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { ClientStatus, ClientType } from "@prisma/client";
import { Filter } from "lucide-react";
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
				className="mb-6"
			/>

			{/* Barre d'actions principale */}
			<div className="mb-6 flex items-center justify-between gap-3 pb-2">
				<div className="flex items-center gap-3 shrink-0">
					<SearchForm
						paramName="search"
						placeholder="Rechercher..."
						className="shrink-0"
					/>
					<RefreshClientsButton organizationId={organizationId} />
				</div>

				<div className="flex items-center gap-3 shrink-0">
					{/* <MultiSelectFilter
						filterKey="status"
						label="Status"
						options={CLIENT_STATUSES}
						className="min-w-[120px] shrink-0"
					/>
					<SelectFilter
						filterKey="clientType"
						label="Type"
						options={CLIENT_TYPES}
						className="min-w-[120px] shrink-0"
					/>
					 */}
					<SortingOptionsDropdown
						sortFields={CLIENT_SORT_FIELDS}
						defaultSortBy="createdAt"
						defaultSortOrder="desc"
						className="min-w-[120px] shrink-0"
					/>
					<Button asChild variant="outline">
						<div className="flex items-center gap-1">
							<Filter className="h-4 w-4" />
							<span>Filtres</span>
						</div>
					</Button>

					<Button className="shrink-0" asChild>
						<Link href={`/dashboard/${organizationId}/clients/new`}>
							Nouveau client
						</Link>
					</Button>
				</div>
			</div>

			{/* Tableau de données */}
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
