import { useActionState } from "react";
import { signInEmail } from "../actions/sign-in-email";
export function useSignInEmail() {
	const [, dispatch, isPending] = useActionState(signInEmail, undefined);

	return {
		dispatch,
		isPending,
	};
}
