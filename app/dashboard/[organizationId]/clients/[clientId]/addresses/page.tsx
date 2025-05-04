import { ADDRESS_TYPES } from "@/domains/address/constants/address-types";
import {
	CreateAddressSheetForm,
	getAddresses,
	searchAddress,
} from "@/domains/address/features";
import { AddressList } from "@/domains/address/features/get-addresses/components";
import { AddressListSkeleton } from "@/domains/address/features/get-addresses/components/address-list-skeleton";
import { ClientHeader, getClient } from "@/domains/client/features/get-client";
import {
	FilterSelect,
	PageContainer,
	SearchForm,
	Toolbar,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { AddressType } from "@prisma/client";
import { Suspense } from "react";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
	searchParams: Promise<{
		postcode?: string;
		citycode?: string;
		limit?: string;
		autocomplete?: string;
		lat?: string;
		lon?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		q?: string;
		search?: string;
		type?: "housenumber" | "street" | "locality" | "municipality";
	}>;
};
export default async function AddressesPage({ searchParams, params }: Props) {
	const {
		q = "",
		postcode,
		citycode,
		limit,
		type,
		search,
		autocomplete,
		lat,
		lon,
	} = await searchParams;
	const { clientId, organizationId } = await params;

	const client = await getClient({ id: clientId, organizationId });

	const filters = {
		type: type as AddressType,
	};

	return (
		<PageContainer className="pt-4 pb-12">
			{/* Breadcrumb amélioré */}

			{/* En-tête client */}

			<ClientHeader client={client} />
			<div className="space-y-6">
				{/* Barre de recherche et filtres */}
				<Toolbar
					leftContent={
						<>
							<SearchForm
								paramName="search"
								placeholder="Rechercher une adresse..."
								className="flex-1 shrink-0"
							/>
						</>
					}
					rightContent={
						<>
							<span className="text-xs font-medium text-muted-foreground px-1">
								Filtrer par:
							</span>

							<FilterSelect
								filterKey="type"
								label="Type"
								options={ADDRESS_TYPES}
							/>
							<Suspense fallback={<></>}>
								<CreateAddressSheetForm
									addressTypes={ADDRESS_TYPES.filter(
										(type) =>
											type.value !== AddressType.COMMERCIAL &&
											type.value !== AddressType.WAREHOUSE &&
											type.value !== AddressType.PRODUCTION &&
											type.value !== AddressType.HEADQUARTERS
									)}
									searchAddressPromise={searchAddress({
										query: q,
										...(postcode && { postcode }),
										...(citycode && { citycode }),
										...(type && { type }),
										...(limit && { limit: parseInt(limit, 10) }),
										...(autocomplete === "0" && { autocomplete: false }),
										...(lat && { lat: parseFloat(lat) }),
										...(lon && { lon: parseFloat(lon) }),
									})}
								/>
							</Suspense>
						</>
					}
				/>

				<Suspense fallback={<AddressListSkeleton />}>
					<AddressList
						addressesPromise={getAddresses({
							search,
							clientId,
							sortBy: "createdAt",
							sortOrder: "desc",
							organizationId,
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
			</div>
		</PageContainer>
	);
}
