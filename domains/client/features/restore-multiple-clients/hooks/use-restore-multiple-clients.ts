"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreMultipleClients } from "../actions/restore-multiple-clients";
import { restoreMultipleClientsSchema } from "../schemas/restore-multiple-clients-schema";

export const useRestoreMultipleClients = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreMultipleClients,
			createToastCallbacks<Client[], typeof restoreMultipleClientsSchema>({
				loadingMessage: "Restauration des clients en cours...",
				onSuccess: (response) => {
					clearAll();
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
