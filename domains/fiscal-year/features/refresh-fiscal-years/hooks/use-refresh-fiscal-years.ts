"use client";

import { useActionState } from "react";
import { refreshFiscalYears } from "../actions/refresh-fiscal-years";

export const useRefreshFiscalYears = () => {
	const [state, dispatch, isPending] = useActionState(
		refreshFiscalYears,
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
