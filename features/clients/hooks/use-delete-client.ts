import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";
import deleteClient from "../actions/delete-client";
import deleteClientSchema from "../schemas/delete-client-schema";

export default function useDeleteClient() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<null, typeof deleteClientSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await deleteClient(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
