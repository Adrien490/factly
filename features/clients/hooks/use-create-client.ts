import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { Client } from "@prisma/client";
import { useActionState } from "react";
import createClient from "../actions/create-client";
import createClientSchema from "../schemas/create-client-schema";

export default function useCreateClient() {
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
