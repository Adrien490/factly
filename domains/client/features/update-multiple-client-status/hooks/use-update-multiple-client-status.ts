"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateMultipleClientStatus } from "../actions/update-multiple-client-status";
import { updateMultipleClientStatusSchema } from "../schemas/update-multiple-client-status-schema";
import { UpdateMultipleClientStatusReturn } from "../types";

export const useUpdateMultipleClientStatus = () => {
	const { clearAll, clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateMultipleClientStatus,
			createToastCallbacks<
				UpdateMultipleClientStatusReturn,
				typeof updateMultipleClientStatusSchema
			>({
				loadingMessage: "Mise à jour du statut en cours...",
				onSuccess: (response) => {
					toast.success(response?.message);
					if (response?.data?.shouldClearAll) {
						clearAll();
					} else if (response?.data?.restoredClientIds) {
						clearItems(response?.data?.restoredClientIds);
					}
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
