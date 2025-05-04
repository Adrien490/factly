"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreClient } from "../actions/restore-client";
import { restoreClientSchema } from "../schemas";

export const useRestoreClient = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreClient,
			createToastCallbacks<Client, typeof restoreClientSchema>({
				loadingMessage: "Restauration du client en cours...",
				onSuccess: (data) => {
					if (data.data?.id) {
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
