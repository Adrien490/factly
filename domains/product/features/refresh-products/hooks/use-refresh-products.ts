"use client";
import { useActionState } from "react";
import { refreshProducts } from "../actions/refresh-products";

export const useRefreshProducts = () => {
	const [state, dispatch, isPending] = useActionState(
		refreshProducts,
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
