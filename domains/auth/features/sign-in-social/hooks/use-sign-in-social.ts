"use client";

import { useActionState } from "react";
import { signInSocial } from "../actions/sign-in-social";

export function useSignInSocial() {
	const [state, dispatch, isPending] = useActionState(signInSocial, undefined);

	return { state, dispatch, isPending };
}
