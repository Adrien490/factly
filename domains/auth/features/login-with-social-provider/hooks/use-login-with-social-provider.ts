"use client";

import { useActionState } from "react";
import { loginWithSocialProvider } from "../actions/login-with-social-provider";

export function useLoginWithSocialProvider() {
	const [state, dispatch, isPending] = useActionState(
		loginWithSocialProvider,
		null
	);

	return { state, dispatch, isPending };
}
