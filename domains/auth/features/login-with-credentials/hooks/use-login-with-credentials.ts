import { useActionState } from "react";
import { loginWithCredentials } from "../actions/login-with-credentials";
export function useLoginWithCredentials() {
	const [, dispatch, isPending] = useActionState(
		loginWithCredentials,
		undefined
	);

	return {
		dispatch,
		isPending,
	};
}
