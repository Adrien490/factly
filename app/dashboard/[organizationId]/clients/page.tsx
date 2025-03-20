import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import clientPriorityOptions from "@/features/clients/lib/client-priority-options";
import clientSortableFields, {
	ClientSortableField,
} from "@/features/clients/lib/client-sortable-fields";
import clientStatusOptions from "@/features/clients/lib/client-status-options";
import getClients from "@/features/clients/queries/get-clients";
import { GetClientsParams } from "@/features/clients/schemas/get-clients-schema";
import DataTable from "@/features/datatable/components/datatable";
import FilterSelect, {
	FilterOption,
} from "@/features/filters/components/filter-select";
import SortOrder from "@/features/sorting/types/sort-order";
import { ClientType } from "@prisma/client";
import Link from "next/link";
import ClientSelectionActions from "./components/client-selection-actions";
import { columns } from "./components/columns";
import { CLIENT_SELECTION_KEY } from "./lib/constants";

// Options pour le type de client
const clientTypeOptions: FilterOption[] = [
	{ value: ClientType.INDIVIDUAL, label: "Particulier" },
	{ value: ClientType.COMPANY, label: "Entreprise" },
];

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

	// Conversion des paramètres
	const queryParams: GetClientsParams = {
		organizationId,
		perPage: Number(perPage) || 10,
		page: Number(page) || 1,
		sortBy: clientSortableFields.includes(sortBy as ClientSortableField)
			? (sortBy as ClientSortableField)
			: "createdAt",
		sortOrder: (sortOrder as SortOrder) || "desc",
		search: search,

		// Traiter tous les filtres
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

	// Bouton pour créer un nouveau client
	const newClientButton = (
		<Button asChild size="default">
			<Link href={`/dashboard/${organizationId}/clients/new`}>
				Nouveau client
			</Link>
		</Button>
	);

	return (
		<PageContainer className="pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Clients"
				description="Gérez votre portefeuille clients"
				action={newClientButton}
				className="mb-6"
			/>

			{/* Contenu principal - Liste des clients */}

			{/* Barre de recherche et filtres */}
			<div className="bg-muted/20 mb-4 p-4 space-y-4">
				{/* Recherche */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
					<SearchForm
						paramName="search"
						placeholder="Rechercher par nom, email, référence, SIREN..."
						className="w-full flex-1 max-w-md"
					/>

					{clients.length > 0 && (
						<div className="hidden md:block text-sm text-muted-foreground">
							{pagination.total} client{pagination.total > 1 ? "s" : ""} trouvé
							{pagination.total > 1 ? "s" : ""}
						</div>
					)}
				</div>

				{/* Filtres */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-medium text-muted-foreground px-1">
						Filtrer par:
					</span>
					<div className="flex flex-wrap gap-2">
						<FilterSelect
							filterKey="status"
							label="Statut"
							options={clientStatusOptions}
							multiple
						/>
						<FilterSelect
							filterKey="clientType"
							label="Type"
							options={clientTypeOptions}
						/>
						<FilterSelect
							filterKey="priority"
							label="Priorité"
							options={clientPriorityOptions}
							multiple
						/>
					</div>
				</div>
			</div>

			{/* Tableau de données */}
			<DataTable
				data={clients}
				columns={columns}
				selection={{
					key: CLIENT_SELECTION_KEY,
					actions: <ClientSelectionActions />,
				}}
				pagination={pagination}
			/>
		</PageContainer>
	);
}
