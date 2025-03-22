import checkClientReference, {
	CheckClientReferenceResponse,
} from "@/features/clients/actions/check-client-reference";
import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";
import checkClientReferenceSchema from "../schemas/check-client-reference-schema";

export default function useCheckClientReference() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<
			CheckClientReferenceResponse,
			typeof checkClientReferenceSchema
		>,
		FormData
	>(
		async (previousState, formData) => {
			return await checkClientReference(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
