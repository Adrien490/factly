"use client";
import { useActionState } from "react";
import { refreshClients } from "../actions";

export const useRefreshClients = () => {
	const [state, dispatch, isPending] = useActionState(refreshClients, null);

	return {
		state,
		dispatch,
		isPending,
	};
};
