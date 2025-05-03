"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteClient } from "../actions/delete-client";
import { deleteClientSchema } from "../schemas";

export const useDeleteClient = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteClient,
			createToastCallbacks<Client, typeof deleteClientSchema>({
				loadingMessage: "Suppression du client en cours...",
				onSuccess: (response) => {
					if (response?.data) {
						clearItems([response.data.id]);
					}
					toast.success(response.message);
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
