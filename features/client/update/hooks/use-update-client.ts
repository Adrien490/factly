"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/features/shared/types/server-action";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { updateClientSchema } from "../schemas";
import { updateClient } from "../utils";

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
