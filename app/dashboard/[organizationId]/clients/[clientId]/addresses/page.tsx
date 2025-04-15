import {
	AddressList,
	getAddresses,
	GetAddressesParams,
} from "@/domains/address";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { SortOrder } from "@/shared/types";
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
	const { perPage, page, sortOrder } = resolvedSearchParams;

	// Conversion des paramètres
	const queryParams: GetAddressesParams = {
		clientId,
		perPage: Number(perPage) || 10,
		page: Number(page) || 1,

		sortOrder: (sortOrder as SortOrder) || "desc",

		// Traiter tous les filtres
	};

	return (
		<PageContainer className="pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Adresses"
				description="Gérez les adresses de votre client"
				action={
					<Button asChild>
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

			{/* Tableau de données */}
			<AddressList addressesPromise={getAddresses(queryParams)} />
		</PageContainer>
	);
}
