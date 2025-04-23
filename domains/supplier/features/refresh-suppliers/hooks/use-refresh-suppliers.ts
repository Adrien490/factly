"use client";
import { useActionState } from "react";
import { refreshSuppliers } from "../actions";

export const useRefreshSuppliers = () => {
	const [state, dispatch, isPending] = useActionState(
		refreshSuppliers,
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
