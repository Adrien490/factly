"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client, ClientStatus } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateClientStatus } from "../actions/update-client-status";
import { updateClientStatusSchema } from "../schemas";

export const useUpdateClientStatus = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateClientStatus,
			createToastCallbacks<Client, typeof updateClientStatusSchema>({
				loadingMessage: "Mise à jour du statut du client en cours...",
				onSuccess: (data) => {
					if (data.data?.status === ClientStatus.ARCHIVED) {
						clearItems([data.data.id]);
					}
					toast.success(data.message);
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
