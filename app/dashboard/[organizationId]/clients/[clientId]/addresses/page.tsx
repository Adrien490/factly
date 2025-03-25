import { getAddresses } from "@/features/addresses";
import { AddressDataTable } from "@/features/addresses/components/address-datatable";
import { GetAddressesParams } from "@/features/addresses/get-list/types";
import { CLIENT_STATUS_OPTIONS } from "@/features/clients/client-status-options";
import { CLIENT_TYPE_OPTIONS } from "@/features/clients/client-type-options";
import { FilterSelect } from "@/shared/components/filter-select";
import { MultiSelectFilter } from "@/shared/components/multi-select-filter";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { SearchForm } from "@/shared/components/search-form";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { SortOrder } from "@/shared/types";
import Link from "next/link";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
	searchParams: Promise<{
		perPage?: string;
		page?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
	}>;
};
export default async function AddressesPage({ searchParams, params }: Props) {
	const resolvedSearchParams = await searchParams;
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;
	const { perPage, page, sortOrder, search, ...filters } = resolvedSearchParams;

	// Conversion des paramètres
	const queryParams: GetAddressesParams = {
		clientId,
		perPage: Number(perPage) || 10,
		page: Number(page) || 1,

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

	return (
		<PageContainer className="pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Adresses"
				description="Gérez les adresses de votre client"
				action={
					<Button>
						<Link
							href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
						>
							Nouvelle adresse
						</Link>
					</Button>
				}
				navigation={{
					items: [
						{
							label: "Liste des adresses",
							href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
						},
						{
							label: "Nouvelle adresse",
							href: `/dashboard/${organizationId}/clients/${clientId}/addresses/new`,
						},
					],
				}}
				className="mb-6"
			/>

			{/* Barre de recherche et filtres */}
			<Card className="mb-4 py-4 space-y-4">
				{/* Recherche */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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

			{/* Tableau de données */}
			<AddressDataTable addressesPromise={getAddresses(queryParams)} />
		</PageContainer>
	);
}
