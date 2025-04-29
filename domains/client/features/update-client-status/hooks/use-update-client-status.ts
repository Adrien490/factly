"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { ClientStatus } from "@prisma/client";
import { useActionState } from "react";
import { updateClientStatus } from "../actions/update-client-status";
import { updateClientStatusSchema } from "../schemas";

export const useUpdateClientStatus = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateClientStatus,
			createToastCallbacks<
				{ id: string; status: ClientStatus },
				typeof updateClientStatusSchema
			>({
				loadingMessage: "Mise à jour du statut du client en cours...",
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
