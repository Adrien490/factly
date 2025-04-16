import {
	CLIENT_STATUSES,
	CLIENT_TYPES,
	ClientSortableField,
} from "@/domains/client";
import { getClients } from "@/domains/client/features/get-clients";
import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	Button,
	Card,
	FilterSelect,
	MultiSelectFilter,
	PageContainer,
	PageHeader,
	SearchForm,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import Link from "next/link";
import { forbidden } from "next/navigation";
import { Suspense } from "react";
import { ClientDataTable, ClientDataTableSkeleton } from "./components";

// Options pour le type de client

type PageProps = {
	searchParams: Promise<{
		perPage?: string;
		cursor?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		[key: string]: string | string[] | undefined;
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
				<Suspense fallback={<ClientDataTableSkeleton />}>
					<ClientDataTable
						clientsPromise={getClients({
							organizationId,
							perPage: Number(perPage) || 10,
							page: Number(page) || 1,
							sortBy: sortBy as ClientSortableField,
							sortOrder: sortOrder as SortOrder,
							search,
							filters: Object.entries(filters).reduce((acc, [key, value]) => {
								if (value) {
									// Préserver les tableaux et les strings
									if (Array.isArray(value)) {
										acc[key] = value;
									} else if (typeof value === "string") {
										acc[key] = value;
									}
								}
								return acc;
							}, {} as Record<string, string | string[]>),
						})}
					/>
				</Suspense>
			</Card>
		</PageContainer>
	);
}
