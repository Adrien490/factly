"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteMultipleClients } from "../actions/delete-multiple-clients";
import { deleteMultipleClientsSchema } from "../schemas";

export const useDeleteMultipleClients = () => {
	const { clearAll } = useSelectionContext();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMultipleClients,
			createToastCallbacks<null, typeof deleteMultipleClientsSchema>({
				loadingMessage: "Suppression des clients en cours...",
				onSuccess: (data) => {
					clearAll();
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
