import { ActionStatus } from "@/shared/types";
import { useActionState } from "react";
import { signInEmail } from "../actions/sign-in-email";

export function useSignInEmail() {
	const [state, dispatch, isPending] = useActionState(signInEmail, {
		status: ActionStatus.INITIAL,
		message: "",
	});

	return {
		state,
		dispatch,
		isPending,
	};
}
