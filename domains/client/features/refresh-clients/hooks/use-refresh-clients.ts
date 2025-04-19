"use client";
import { GetOrganizationReturn } from "@/domains/organization/features/get-organization";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { refreshClients } from "../actions";
import { refreshClientsSchema } from "../schemas";

export const useRefreshClients = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			refreshClients,
			createToastCallbacks<GetOrganizationReturn, typeof refreshClientsSchema>({
				loadingMessage: "Rafraîchissement des clients en cours...",
			})
		),
		null
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
