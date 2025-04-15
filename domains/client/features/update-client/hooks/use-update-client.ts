"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { updateClient } from "../actions/update-client";
import { updateClientSchema } from "../schemas";

export function useUpdateClient() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Client, typeof updateClientSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateClient(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
