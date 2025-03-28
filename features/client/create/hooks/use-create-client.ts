"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/features/shared/types/server-action";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import { createClientSchema } from "../schemas";
import { createClient } from "../utils/create-client";

export function useCreateClient() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Client, typeof createClientSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createClient(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
