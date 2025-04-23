"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { setFiscalYearAsDefault } from "../actions/set-fiscal-year-as-default";
import { setFiscalYearAsDefaultSchema } from "../schemas";

export const useSetFiscalYearAsDefault = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			setFiscalYearAsDefault,
			createToastCallbacks<null, typeof setFiscalYearAsDefaultSchema>({
				loadingMessage: "Définition de l'année fiscale par défaut en cours...",
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
