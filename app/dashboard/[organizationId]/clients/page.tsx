import {
	CLIENT_SORTABLE_FIELDS,
	ClientSortableField,
	GetClientsQueryParams,
} from "@/app/dashboard/[organizationId]/clients/schemas/get-clients-schema";
import getClients from "@/app/dashboard/[organizationId]/clients/server/get-clients";
import DataTable from "@/components/datatable";
import FilterSheet from "@/components/filter-sheet";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SortOrder } from "@/schemas/sort-order-schema";
import { ClientStatus } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import ClientSelectionActions from "./components/client-selection-actions";
import { columns } from "./components/columns";
import RefreshButton from "./components/refresh-button";
import { CLIENT_FILTERS } from "./lib/client-enums";
import { CLIENT_SELECTION_KEY } from "./lib/constants";

type PageProps = {
	searchParams: Promise<{
		perPage?: string;
		cursor?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		status?: string;
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
	const { perPage, page, sortBy, sortOrder, search, status, ...filters } =
		resolvedSearchParams;

	// Conversion des paramètres
	const queryParams: GetClientsQueryParams = {
		organizationId,
		perPage: Number(perPage) || 10,
		page: Number(page) || 1,

		sortBy: CLIENT_SORTABLE_FIELDS.includes(sortBy as ClientSortableField)
			? (sortBy as ClientSortableField)
			: "createdAt",
		sortOrder: (sortOrder as SortOrder) || "desc",
		search: search,
		status: Object.values(ClientStatus).includes(status as ClientStatus)
			? (status as ClientStatus)
			: undefined,
		filters: Object.entries(filters)
			.filter(([key]) => key.startsWith("filter_"))
			.reduce(
				(acc, [key, value]) => ({
					...acc,
					[key.replace("filter_", "")]: value,
				}),
				{}
			),
	};

	// Récupération des données avec les paramètres
	const { clients, pagination } = await getClients(queryParams);

	const breadcrumbs = [
		{ label: "Dashboard", href: `/dashboard/${organizationId}` },
		{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
	];

	return (
		<div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col gap-8">
			{/* En-tête */}
			<div className="flex flex-col gap-4">
				<PageHeader
					title="Clients"
					breadcrumbs={breadcrumbs}
					description="Gérez vos clients et leurs informations"
				/>
				<Separator />
			</div>

			{/* Contenu principal */}
			<div className="flex flex-col gap-6">
				{/* Barre d'outils */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col items-start gap-4 lg:flex-row">
						{/* Recherche */}
						<SearchForm
							paramName="search"
							placeholder="Rechercher un client..."
							className="w-full lg:w-[280px]"
						/>

						{/* Filtres */}
						<div className="flex min-h-[36px] flex-1 flex-wrap items-center gap-2">
							<FilterSheet filters={CLIENT_FILTERS} />
						</div>

						{/* Actions */}
						<div className="flex w-full items-center gap-2 lg:w-auto">
							<RefreshButton />
							<Button
								asChild
								size="sm"
								className="flex-1 whitespace-nowrap lg:flex-initial"
							>
								<Link href={`/dashboard/${organizationId}/clients/new`}>
									<PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
									Ajouter un client
								</Link>
							</Button>
						</div>
					</div>
				</div>

				<DataTable
					data={clients}
					columns={columns}
					selection={{
						key: CLIENT_SELECTION_KEY,
						actions: <ClientSelectionActions />,
					}}
					pagination={pagination}
				/>
			</div>
		</div>
	);
}
