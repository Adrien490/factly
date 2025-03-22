import INVITATION_SORTABLE_FIELDS, {
	INVITATION_SORT_OPTIONS,
	InvitationSortableField,
} from "@/features/invitations/lib/invitation-sortable-fields";
import { INVITATION_STATUS_OPTIONS } from "@/features/invitations/lib/invitation-status-options";
import getInvitations from "@/features/invitations/queries/get-invitations";
import DropdownMenuFilter from "@/shared/components/dropdown-menu-filter";
import { PageContainer } from "@/shared/components/page-container";
import { SearchForm } from "@/shared/components/search-form";
import SortOrder from "@/shared/components/sorting/types/sort-order";
import { ToggleView } from "@/shared/components/toggle-view";
import { Button } from "@/shared/components/ui/button";
import { InvitationStatus } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";
import InvitationList from "./components/invitation-list";

type Props = {
	searchParams: Promise<{
		perPage?: string;
		page?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		status?: string;
	}>;
};

export default async function InvitationsPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;
	const { sortBy, sortOrder, search, status } = resolvedSearchParams;

	// Conversion des paramètres
	const queryParams = {
		sortBy: INVITATION_SORTABLE_FIELDS.includes(
			sortBy as InvitationSortableField
		)
			? (sortBy as InvitationSortableField)
			: "createdAt",
		sortOrder: (sortOrder as SortOrder) || "desc",
		search: search,
		status: Object.values(InvitationStatus).includes(status as InvitationStatus)
			? (status as InvitationStatus)
			: undefined,
	};

	return (
		<PageContainer className="space-y-6 group">
			<div className="flex flex-col gap-4 md:flex-row md:items-center">
				{/* Recherche à gauche prenant toute la place disponible */}

				<SearchForm
					paramName="search"
					placeholder="Rechercher une invitation..."
					className="w-full flex-1"
				/>

				{/* Actions à droite */}
				<div className="flex flex-wrap items-center gap-2 shrink-0">
					{/* Sélecteur de tri */}
					<DropdownMenuFilter
						options={INVITATION_STATUS_OPTIONS}
						defaultValue="PENDING"
						paramName="status"
						label="Statut"
					/>
					<DropdownMenuFilter
						options={INVITATION_SORT_OPTIONS}
						defaultValue="createdAt"
						paramName="sortBy"
						label="Trier par"
					/>

					{/* Sélecteur de vue */}
					<ToggleView />

					<Link href="/dashboard/invitations/new">
						<Button className="h-9">Nouvelle invitation</Button>
					</Link>
				</div>
			</div>
			<Suspense>
				<InvitationList invitationsPromise={getInvitations(queryParams)} />
			</Suspense>
		</PageContainer>
	);
}
