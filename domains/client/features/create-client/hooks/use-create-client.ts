"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { createClient } from "../actions/create-client";
import { createClientSchema } from "../schemas";

export function useCreateClient() {
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createClient,
			createToastCallbacks<Client, typeof createClientSchema>({
				loadingMessage: "Création du client en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						action: {
							label: "Voir le client",
							onClick: () => {
								if (result.data?.id) {
									router.push(
										`/dashboard/${result.data.organizationId}/clients/${result.data.id}`
									);
								}
							},
						},
					});
				},
			})
		),
		null
	);

	return {
		state,
		dispatch,
		isPending,
	};
}
