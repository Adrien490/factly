"use client";

import { useActionState } from "react";
import { refreshProductCategories } from "../actions/refresh-product-categories";

export const useRefreshProductCategories = () => {
	const [state, dispatch, isPending] = useActionState(
		refreshProductCategories,
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
