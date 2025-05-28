"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { updateClient, updateClientSchema } from "../../update-client";

export function useUpdateClient() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateClient,
			createToastCallbacks<Client, typeof updateClientSchema>({
				loadingMessage: "Mise à jour du client en cours...",
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
