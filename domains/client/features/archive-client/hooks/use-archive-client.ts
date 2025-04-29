"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveClient } from "../actions/archive-client";
import { archiveClientSchema } from "../schemas";

export const useArchiveClient = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveClient,
			createToastCallbacks<Client, typeof archiveClientSchema>({
				loadingMessage: "Archivage du client en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
					});
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
};
