import { auth } from "@/domains/auth";
import {
	InvitationDataTable,
	InvitationDataTableSkeleton,
} from "@/domains/invitation/components/invitation-datatable";
import {
	getInvitations,
	InvitationSortableField,
} from "@/domains/invitation/features/get-invitations";
import { PageContainer } from "@/shared/components";

import { headers } from "next/headers";
import { Suspense } from "react";

type Props = {
	searchParams: Promise<{
		sortBy?: string;
		sortOrder?: "asc" | "desc";
	}>;
};

export default async function InvitationsPage({ searchParams }: Props) {
	// Récupération des organisations avec les options par défaut
	const resolvedSearchParams = await searchParams;
	const { sortBy, sortOrder } = resolvedSearchParams;

	return (
		<PageContainer className="space-y-6 py-6 group">
			{/* Barre d'outils principale */}

			{/* Liste des organisations */}
			<Suspense fallback={<InvitationDataTableSkeleton columnCount={0} />}>
				<InvitationDataTable
					invitationsPromise={getInvitations({
						sortBy: sortBy as InvitationSortableField,
						sortOrder: sortOrder as "asc" | "desc",
					})}
					userPromise={auth.api
						.getSession({ headers: await headers() })
						.then((session) => session?.user ?? null)}
				/>
			</Suspense>
		</PageContainer>
	);
}
