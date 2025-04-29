"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateMultipleClientStatus } from "../actions/update-multiple-client-status";
import { updateMultipleClientStatusSchema } from "../schemas/update-multiple-client-status-schema";

export const useUpdateMultipleClientStatus = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateMultipleClientStatus,
			createToastCallbacks<null, typeof updateMultipleClientStatusSchema>({
				loadingMessage: "Mise à jour du statut en cours...",
				onSuccess: (data) => {
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
