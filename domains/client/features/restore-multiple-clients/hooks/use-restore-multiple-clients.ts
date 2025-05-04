"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreMultipleClients } from "../actions/restore-multiple-clients";
import { restoreMultipleClientsSchema } from "../schemas/restore-multiple-clients-schema";
import { RestoreMultipleClientsReturn } from "../types";

export const useRestoreMultipleClients = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreMultipleClients,
			createToastCallbacks<Client[], typeof restoreMultipleClientsSchema>({
				loadingMessage: "Restauration des clients en cours...",
				onSuccess: (response) => {
					const data =
						response?.data as unknown as RestoreMultipleClientsReturn;
					if (data?.restoredClientIds?.length > 0) {
						clearItems(data.restoredClientIds);
					}
					toast.success(response?.message);
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
