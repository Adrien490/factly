"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteMultipleClients } from "../actions";
import { deleteMultipleClientsSchema } from "../schemas";

export const useDeleteMultipleClients = () => {
	const { clearSelection } = useSelectionContext();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMultipleClients,
			createToastCallbacks<null, typeof deleteMultipleClientsSchema>({
				loadingMessage: "Suppression des clients en cours...",
				onSuccess: (data) => {
					clearSelection();
					toast.success(data?.message);
				},
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
