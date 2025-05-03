"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client, ClientStatus } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveClient } from "../actions/archive-client";
import { archiveClientSchema } from "../schemas";

export const useArchiveClient = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveClient,
			createToastCallbacks<Client, typeof archiveClientSchema>({
				loadingMessage: "Archivage du client en cours...",
				onSuccess: (data) => {
					if (data.data?.status === ClientStatus.ARCHIVED) {
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
