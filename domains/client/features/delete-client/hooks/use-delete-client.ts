"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteClient, deleteClientSchema } from "../actions";

export const useDeleteClient = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteClient,
			createToastCallbacks<null, typeof deleteClientSchema>({
				loadingMessage: "Suppression du client en cours...",
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
