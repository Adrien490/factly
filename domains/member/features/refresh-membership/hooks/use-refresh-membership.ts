"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { refreshMembership } from "../actions/refresh-membership";
import { refreshMembershipSchema } from "../schemas";

export const useRefreshMembership = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			refreshMembership,
			createToastCallbacks<null, typeof refreshMembershipSchema>({
				loadingMessage: "Rafraîchissement du membership en cours...",
				onSuccess: () => {
					window.location.reload();
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
};
