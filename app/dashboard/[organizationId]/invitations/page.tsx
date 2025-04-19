import { SortOrder } from "@/shared/types";
import { InvitationStatus } from "@prisma/client";

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
	const resolvedSearchParams = await searchParams;
	const resolvedParams = await params;

	const { organizationId } = resolvedParams;
	const { sortBy, sortOrder, status, expiresAt } = resolvedSearchParams;

	console.log(organizationId, sortBy, sortOrder, status, expiresAt);

	return <div>Invitations</div>;
}
