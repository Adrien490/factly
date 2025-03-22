"use client";

import { type GetInvitationsReturn } from "@/features/invitations/queries/get-invitations";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import InvitationCard from "./invitation-card";

type ViewType = "grid" | "list";

type InvitationListProps = {
	invitationsPromise: Promise<GetInvitationsReturn>;
};

export default function InvitationList({
	invitationsPromise,
}: InvitationListProps) {
	// Récupération des invitations depuis la Promise
	const invitations = use(invitationsPromise);
	const searchParams = useSearchParams();
	const viewMode = (searchParams.get("view") as ViewType) || "grid";

	// Affichage de l'état vide (pas d'invitations)
	if (invitations.length === 0) {
		return (
			<EmptyState
				icon={Mail}
				title="Aucune invitation"
				description="Vous n'avez aucune invitation à rejoindre une organisation"
			/>
		);
	}

	// Container adaptatif selon le mode de vue
	const containerClassName =
		viewMode === "grid"
			? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
			: "space-y-3";

	return (
		<div className={containerClassName}>
			{invitations.map((invitation) => (
				<InvitationCard
					key={invitation.id}
					invitation={invitation}
					viewMode={viewMode}
				/>
			))}
		</div>
	);
}
