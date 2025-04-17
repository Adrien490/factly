import { ADDRESS_TYPES } from "@/domains/address/constants/address-types";
import { getAddresses } from "@/domains/address/features";
import { AddressList } from "@/domains/address/features/get-addresses/components";
import { AddressListSkeleton } from "@/domains/address/features/get-addresses/components/address-list/components/address-list-skeleton/address-list-skeleton";
import {
	Button,
	FilterSelect,
	SearchForm,
	ViewToggle,
} from "@/shared/components";
import { SortOrder, ViewType } from "@/shared/types";
import { AddressType } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";

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
		type?: string;
		view?: string;
	}>;
};
export default async function AddressesPage({ searchParams, params }: Props) {
	const resolvedSearchParams = await searchParams;
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;
	const { sortOrder, view, search, type } = resolvedSearchParams;

	const filters = {
		type: type as AddressType,
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Liste des adresses</h2>

			{/* Barre de recherche et filtres */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
				<SearchForm
					paramName="search"
					placeholder="Rechercher une adresse..."
					className="flex-1 shrink-0"
				/>
				<ViewToggle />
				<span className="text-xs font-medium text-muted-foreground px-1">
					Filtrer par:
				</span>

				<FilterSelect filterKey="type" label="Type" options={ADDRESS_TYPES} />

				<Button className="shrink-0" asChild>
					<Link
						href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
					>
						Nouvelle adresse
					</Link>
				</Button>
			</div>

			<Suspense fallback={<AddressListSkeleton />}>
				<AddressList
					viewType={view as ViewType}
					addressesPromise={getAddresses({
						search,
						clientId,
						sortBy: "createdAt",
						sortOrder: (sortOrder as SortOrder) || "desc",
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
	);
}
