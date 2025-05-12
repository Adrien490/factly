import { CIVILITY_OPTIONS } from "@/domains/contact/constants/civility-options";
import { CreateContactSheetForm } from "@/domains/contact/features/create-contact/components/create-contact-sheet-form";
import { getContacts } from "@/domains/contact/features/get-contacts";
import { ContactDataTable } from "@/domains/contact/features/get-contacts/components/contact-datatable";
import { GetContactsSortBy } from "@/domains/contact/features/get-contacts/types";
import {
	FilterSelect,
	SearchForm,
	SortingOptionsDropdown,
	Toolbar,
} from "@/shared/components";
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
					filterKey="civility"
					label="Civilité"
					options={CIVILITY_OPTIONS}
				/>
				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Nom",
							value: "lastName",
						},
						{
							label: "Prénom",
							value: "firstName",
						},
					]}
					defaultSortBy="lastName"
					defaultSortOrder="asc"
					className="w-[200px] shrink-0"
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
