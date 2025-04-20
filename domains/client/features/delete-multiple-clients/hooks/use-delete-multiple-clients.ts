"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteMultipleClients } from "../actions";
import { deleteMultipleClientsSchema } from "../schemas";

export const useDeleteMultipleClients = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMultipleClients,
			createToastCallbacks<null, typeof deleteMultipleClientsSchema>({
				loadingMessage: "Suppression des clients en cours...",
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
