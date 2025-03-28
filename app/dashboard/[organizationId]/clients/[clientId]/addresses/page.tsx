import { AddressList, getAddresses } from "@/features/address";
import { ADDRESS_TYPE_OPTIONS } from "@/features/address/address-type-options";
import { GetAddressesParams } from "@/features/address/get-all/types";
import { FilterSelect } from "@/features/shared/components/filter-select";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
import { SearchForm } from "@/features/shared/components/search-form";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { ViewToggle } from "@/features/shared/components/view-toggle";
import { SortOrder } from "@/features/shared/types";
import Link from "next/link";
import { clientNavigation } from "../constants";
import { clientBreadcrumbs } from "../constants/client-breadcrumbs";

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
				breadcrumbs={clientBreadcrumbs(organizationId, clientId)}
				navigation={{
					items: clientNavigation(organizationId, clientId),
				}}
				className="mb-6"
			/>

			{/* Barre de recherche et filtres */}
			<Card className="mb-4 py-4 space-y-4 px-2">
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
						<FilterSelect
							filterKey="addressType"
							label="Type"
							options={ADDRESS_TYPE_OPTIONS}
						/>
						<ViewToggle />
					</div>
				</div>
			</Card>

			{/* Tableau de données */}
			<AddressList addressesPromise={getAddresses(queryParams)} />
		</PageContainer>
	);
}
