"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteSupplier } from "../actions/delete-supplier";
import { deleteSupplierSchema } from "../schemas";

export const useDeleteSupplier = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteSupplier,
			createToastCallbacks<null, typeof deleteSupplierSchema>({
				loadingMessage: "Suppression du fournisseur en cours...",
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
