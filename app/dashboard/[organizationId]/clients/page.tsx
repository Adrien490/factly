import { CLIENT_STATUS_OPTIONS } from "@/features/client/client-status-options";
import { CLIENT_TYPE_OPTIONS } from "@/features/client/client-type-options";
import { getClients } from "@/features/client/get-all";
import { ClientDatatable } from "@/features/client/get-all/components";
import {
	ClientSortableField,
	clientSortableFields,
} from "@/features/client/get-all/constants/client-sortable-fields";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import { FilterSelect } from "@/features/shared/components/filter-select";
import { MultiSelectFilter } from "@/features/shared/components/multi-select-filter";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
import { SearchForm } from "@/features/shared/components/search-form";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { SortOrder } from "@/features/shared/types";
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
				<ClientDatatable
					clientsPromise={getClients({
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
					})}
				/>
			</Card>
		</PageContainer>
	);
}
