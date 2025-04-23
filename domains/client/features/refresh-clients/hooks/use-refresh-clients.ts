"use client";
import { useActionState } from "react";
import { refreshClients } from "../actions/refresh-clients";

export const useRefreshClients = () => {
	const [state, dispatch, isPending] = useActionState(
		refreshClients,
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
