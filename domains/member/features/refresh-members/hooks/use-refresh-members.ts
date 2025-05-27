"use client";
import { useActionState } from "react";
import { refreshMembers } from "../actions/refresh-members";

export const useRefreshMembers = () => {
	const [state, dispatch, isPending] = useActionState(
		refreshMembers,
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
