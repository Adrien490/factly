import {
	GET_CLIENTS_SORT_FIELDS,
	getClients,
} from "@/domains/client/features/get-clients";
import { getClientNavigation } from "@/domains/client/utils";

import {
	ArchivedClientSelectionActions,
	ClientSelectionActions,
} from "@/domains/client/components";
import { ClientFilterSheet } from "@/domains/client/components/client-filter-sheet";
import {
	ClientDataTable,
	ClientDataTableSkeleton,
} from "@/domains/client/features/get-clients/components";
import { RefreshClientsButton } from "@/domains/client/features/refresh-clients/components";
import {
	Button,
	HorizontalMenu,
	PageContainer,
	PageHeader,
	SearchForm,
	SelectionToolbar,
	SortingOptionsDropdown,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { ClientStatus, ClientType } from "@prisma/client";
import { Trash2, Undo2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Options pour le type de client

type PageProps = {
	searchParams: Promise<{
		selected?: string[];
		perPage?: string;
		page?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		status?: ClientStatus | ClientStatus[];
		type?: ClientType;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function ClientsPage({ searchParams, params }: PageProps) {
	const { perPage, page, sortBy, sortOrder, search, status, type, selected } =
		await searchParams;
	const { organizationId } = await params;

	const filters: Record<string, string | string[]> = {};
	const selectedClientIds = !Array.isArray(selected)
		? selected
			? [selected]
			: []
		: (selected.filter(Boolean) as string[]);
	if (status) {
		filters.status = status;
	} else {
		filters.status = Object.values(ClientStatus).filter(
			(status) => status !== ClientStatus.ARCHIVED
		);
	}
	if (type) filters.type = type;

	const activeFiltersCount = Object.keys(filters).filter((key) => {
		if (key === "status" && !status) return false;
		if (key === "status" && status === ClientStatus.ARCHIVED) return false;
		return true;
	}).length;

	const isArchivedView = status === ClientStatus.ARCHIVED;

	return (
		<PageContainer className="group pb-12">
			<PageHeader
				title="Clients"
				description="Gérez votre portefeuille clients"
			/>

			<HorizontalMenu items={getClientNavigation(organizationId)} />

			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher..."
					className="flex-1 shrink-0"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<RefreshClientsButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Rafraîchir la liste des clients</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Nom",
							value: "name",
						},
						{
							label: "Référence",
							value: "reference",
						},
						{
							label: "Date de création",
							value: "createdAt",
						},
					]}
					defaultSortBy="createdAt"
					defaultSortOrder="desc"
					className="w-[200px] shrink-0"
				/>

				<ClientFilterSheet
					activeFiltersCount={activeFiltersCount}
					isArchivedView={isArchivedView}
				/>

				{isArchivedView ? (
					<Button variant="default" className="shrink-0" asChild>
						<Link href={`/dashboard/${organizationId}/clients`}>
							<Undo2 className="h-4 w-4 mr-2" />
							Voir tous les clients
						</Link>
					</Button>
				) : (
					<Button variant="outline" className="shrink-0" asChild>
						<Link
							href={`/dashboard/${organizationId}/clients?status=${ClientStatus.ARCHIVED}`}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Voir les clients archivés
						</Link>
					</Button>
				)}

				<Button className="shrink-0" asChild>
					<Link href={`/dashboard/${organizationId}/clients/new`}>
						Nouveau client
					</Link>
				</Button>
			</Toolbar>

			<SelectionToolbar>
				{isArchivedView ? (
					<ArchivedClientSelectionActions
						selectedClientIds={selectedClientIds}
						organizationId={organizationId}
					/>
				) : (
					<ClientSelectionActions
						selectedClientIds={selectedClientIds}
						organizationId={organizationId}
					/>
				)}
			</SelectionToolbar>
			<Suspense fallback={<ClientDataTableSkeleton />}>
				<ClientDataTable
					clientsPromise={getClients({
						organizationId,
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as (typeof GET_CLIENTS_SORT_FIELDS)[number],
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
