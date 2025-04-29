"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { ClientStatus } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateMultipleClientStatus } from "../actions/update-multiple-client-status";
import { updateMultipleClientStatusSchema } from "../schemas/update-multiple-client-status-schema";

export const useUpdateMultipleClientStatus = () => {
	const { clearSelection } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateMultipleClientStatus,
			createToastCallbacks<
				{ number: number; status: ClientStatus },
				typeof updateMultipleClientStatusSchema
			>({
				loadingMessage: "Mise à jour du statut en cours...",
				onSuccess: (response) => {
					toast.success(response?.message);
					if (response?.data?.status === ClientStatus.ARCHIVED) {
						clearSelection();
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
