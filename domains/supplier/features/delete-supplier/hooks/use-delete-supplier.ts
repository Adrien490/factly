"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteSupplier, deleteSupplierSchema } from "../actions";

export const useDeleteSupplier = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteSupplier,
			createToastCallbacks<null, typeof deleteSupplierSchema>({
				loadingMessage: "Suppression du fournisseur en cours...",
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
