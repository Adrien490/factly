"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteClient } from "../actions/delete-client";
import { deleteClientSchema } from "../schemas";

export const useDeleteClient = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteClient,
			createToastCallbacks<null, typeof deleteClientSchema>({
				loadingMessage: "Suppression du client en cours...",
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
