import { auth } from "@/domains/auth";
import {
	InvitationDataTable,
	InvitationDataTableSkeleton,
} from "@/domains/invitation/components/invitation-datatable";
import { CreateInvitationForm } from "@/domains/invitation/features/create-invitation";
import { getInvitations } from "@/domains/invitation/features/get-invitations";
import {
	PageContainer,
	PageHeader,
	SearchForm,
	Toolbar,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { InvitationStatus } from "@prisma/client";
import { headers } from "next/headers";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		// Pagination
		perPage?: string;
		page?: string;

		// Tri
		sortBy?: string;
		sortOrder?: SortOrder;

		// Recherche

		// Filtres
		status?: InvitationStatus | InvitationStatus[];
		expiresAt?: "expired" | "active";
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function InvitationsPage({
	searchParams,
	params,
}: PageProps) {
	const { sortBy, sortOrder, status, expiresAt } = await searchParams;
	const { organizationId } = await params;

	console.log(organizationId, sortBy, sortOrder, status, expiresAt);

	return (
		<PageContainer className="pb-12 group">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Clients"
				description="Gérez votre portefeuille clients"
			/>

			{/* Barre d'actions principale */}
			<Toolbar
				leftContent={
					<>
						<SearchForm
							paramName="search"
							placeholder="Rechercher..."
							className="w-[275px] shrink-0 sm:w-[200px] lg:w-[275px]"
						/>
					</>
				}
				rightContent={
					<>
						<CreateInvitationForm organizationId={organizationId} />
					</>
				}
			/>

			{/* Tableau de données */}
			<Suspense fallback={<InvitationDataTableSkeleton columnCount={4} />}>
				<InvitationDataTable
					userPromise={auth.api
						.getSession({ headers: await headers() })
						.then((session) => session?.user ?? null)}
					invitationsPromise={getInvitations({
						organizationId,
						sortBy: sortBy as "expiresAt" | "createdAt",
						sortOrder: sortOrder as SortOrder,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
