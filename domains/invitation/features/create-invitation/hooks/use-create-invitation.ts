"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Invitation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createInvitation } from "../actions/create-invitation";
import { createInvitationSchema } from "../schemas";

export function useCreateInvitation() {
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createInvitation,
			createToastCallbacks<Invitation, typeof createInvitationSchema>({
				loadingMessage: "Envoi de l'invitation en cours...",
				action: {
					label: "Voir les invitations",
					onClick: (data) => {
						if (data?.organizationId) {
							router.push(`/dashboard/${data.organizationId}/settings/members`);
						}
					},
				},
			})
		),
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
}
