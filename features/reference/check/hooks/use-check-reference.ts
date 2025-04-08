import { checkReference } from "@/features/reference/check";
import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";
import { checkReferenceSchema } from "../schemas";
import { CheckReferenceResponse } from "../types";

export function useCheckReference() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<CheckReferenceResponse, typeof checkReferenceSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await checkReference(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
