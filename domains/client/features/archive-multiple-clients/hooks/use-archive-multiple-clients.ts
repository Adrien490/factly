"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveMultipleClients } from "../actions/archive-multiple-clients";
import { archiveMultipleClientsSchema } from "../schemas/archive-multiple-clients-schema";

export const useArchiveMultipleClients = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveMultipleClients,
			createToastCallbacks<Client[], typeof archiveMultipleClientsSchema>({
				loadingMessage: "Archivage des clients en cours...",
				onSuccess: (response) => {
					toast.success(response?.message);
					clearAll();
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
