"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";
import { deleteClient } from "../actions";
import { deleteClientSchema } from "../schemas";

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
