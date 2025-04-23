"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteFiscalYear } from "../actions/delete-fiscal-year";
import { deleteFiscalYearSchema } from "../schemas";

export const useDeleteFiscalYear = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteFiscalYear,
			createToastCallbacks<null, typeof deleteFiscalYearSchema>({
				loadingMessage: "Suppression de l'année fiscale en cours...",
			})
		),
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
