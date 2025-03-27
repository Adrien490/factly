"use client";

import {
	deleteMultipleClients,
	deleteMultipleClientsSchema,
} from "@/features/client/delete-multiple/utils";
import {
	ServerActionState,
	ServerActionStatus,
} from "@/features/shared/types/server-action";
import { useActionState } from "react";

export const useDeleteMultipleClients = () => {
	const [state, action, isPending] = useActionState<
		ServerActionState<null, typeof deleteMultipleClientsSchema>,
		FormData
	>(deleteMultipleClients, {
		message: "",
		status: ServerActionStatus.INITIAL,
	});

	return {
		state,
		action,
		isPending,
	};
};
