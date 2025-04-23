"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteClients } from "../actions/delete-clients";
import { deleteClientsSchema } from "../schemas";

export const useDeleteClients = () => {
	const { clearSelection } = useSelectionContext();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteClients,
			createToastCallbacks<null, typeof deleteClientsSchema>({
				loadingMessage: "Suppression des clients en cours...",
				onSuccess: (data) => {
					clearSelection();
					toast.success(data?.message);
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
