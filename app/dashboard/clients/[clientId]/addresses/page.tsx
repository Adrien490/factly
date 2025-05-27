import {
	CreateAddressSheetForm,
	getAddresses,
	searchAddress,
} from "@/domains/address/features";
import { AddressList } from "@/domains/address/features/get-addresses/components";
import { AddressListSkeleton } from "@/domains/address/features/get-addresses/components/address-list-skeleton";
import { CLIENT_ADDRESS_TYPES } from "@/domains/client/constants";
import { FilterSelect, SearchForm, Toolbar } from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { AddressType } from "@prisma/client";
import { Suspense } from "react";

type Props = {
	params: Promise<{
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
	const { clientId } = await params;

	const filters = {
		type: type as AddressType,
	};

	return (
		<div className="space-y-6">
			{/* Barre de recherche et filtres */}
			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher une adresse..."
					className="flex-1 shrink-0"
				/>

				<span className="text-xs font-medium text-muted-foreground px-1">
					Filtrer par:
				</span>

				<FilterSelect
					filterKey="type"
					label="Type"
					options={CLIENT_ADDRESS_TYPES}
				/>
				<Suspense fallback={<></>}>
					<CreateAddressSheetForm
						addressTypes={CLIENT_ADDRESS_TYPES}
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
			</Toolbar>

			<Suspense fallback={<AddressListSkeleton />}>
				<AddressList
					addressesPromise={getAddresses({
						search,
						clientId,
						sortBy: "createdAt",
						sortOrder: "desc",
						filters: Object.entries(filters).reduce(
							(acc, [key, value]) => {
								if (value) {
									// Préserver les tableaux et les strings
									if (Array.isArray(value)) {
										acc[key] = value;
									} else if (typeof value === "string") {
										acc[key] = value;
									}
								}
								return acc;
							},
							{} as Record<string, string | string[]>
						),
					})}
				/>
			</Suspense>
		</div>
	);
}
