"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createClient } from "../actions/create-client";
import { createClientSchema } from "../schemas/create-client-schema";

export function useCreateClient() {
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createClient,
			createToastCallbacks<Client, typeof createClientSchema>({
				loadingMessage: "Création du client en cours...",
				action: {
					label: "Voir le client",
					onClick: (data) => {
						if (data?.id) {
							router.push(`/dashboard/commercial/clients/${data.id}`);
						}
					},
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
}
