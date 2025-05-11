import { CIVILITIES } from "@/domains/contact/constants/civilities";
import { CreateContactSheetForm } from "@/domains/contact/features/create-contact/components/create-contact-sheet-form";
import { getContacts } from "@/domains/contact/features/get-contacts";
import { ContactDataTable } from "@/domains/contact/features/get-contacts/components/contact-datatable";
import { GetContactsSortBy } from "@/domains/contact/features/get-contacts/types";
import { FilterSelect, SearchForm, Toolbar } from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { Civility } from "@prisma/client";
import { Suspense } from "react";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
	searchParams: Promise<{
		civility?: Civility;
		isDefault?: boolean;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
	}>;
};
export default async function AddressesPage({ searchParams, params }: Props) {
	const { civility, isDefault, search, sortBy, sortOrder } = await searchParams;
	const { clientId, organizationId } = await params;

	console.log(civility, isDefault, search, clientId, organizationId);

	const filters = {
		civility,
		isDefault,
	};

	console.log(filters);

	return (
		<div className="space-y-6">
			{/* Barre de recherche et filtres */}
			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher un contact..."
					className="flex-1 shrink-0"
				/>

				<span className="text-xs font-medium text-muted-foreground px-1">
					Filtrer par:
				</span>

				<FilterSelect
					filterKey="type"
					label="Type"
					options={CIVILITIES.map((civility) => ({
						value: civility.value,
						label: civility.label,
					}))}
				/>

				<CreateContactSheetForm />
			</Toolbar>

			<Suspense fallback={<div>Loading...</div>}>
				<ContactDataTable
					contactsPromise={getContacts({
						clientId,
						organizationId,
						sortBy: sortBy as GetContactsSortBy,
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</div>
	);
}
