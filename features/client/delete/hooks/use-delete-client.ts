"use client";

import {
	deleteClient,
	deleteClientSchema,
} from "@/features/client/delete/utils";
import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";

export const useDeleteClient = () => {
	const [state, action, isPending] = useActionState<
		ServerActionState<null, typeof deleteClientSchema>,
		FormData
	>(deleteClient, {
		message: "",
		status: ServerActionStatus.INITIAL,
	});

	return {
		state,
		action,
		isPending,
	};
};
