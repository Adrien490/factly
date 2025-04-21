"use client";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { refreshSuppliers } from "../actions";
import { refreshSuppliersSchema } from "../schemas";

export const useRefreshSuppliers = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			refreshSuppliers,
			createToastCallbacks<null, typeof refreshSuppliersSchema>({
				loadingMessage: "Rafraîchissement des fournisseurs en cours...",
			})
		),
		null
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
