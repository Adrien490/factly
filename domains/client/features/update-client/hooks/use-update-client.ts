"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateClient, updateClientSchema } from "../../update-client";

export function useUpdateClient() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateClient,
			createToastCallbacks<Client, typeof updateClientSchema>({
				loadingMessage: "Mise à jour du client en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
						action: {
							label: "Voir le client",
							onClick: () => {
								router.push(
									`/dashboard/${result.data?.organizationId}/clients/${result.data?.id}`
								);
							},
						},
					});
				},
			})
		),
		null
	);

	return { state, dispatch, isPending };
}
