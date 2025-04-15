"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";
import { deleteMultipleClients } from "../actions";
import { deleteMultipleClientsSchema } from "../schemas";

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
