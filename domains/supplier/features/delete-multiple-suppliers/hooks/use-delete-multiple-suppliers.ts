"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteMultipleSuppliers } from "../actions";
import { deleteMultipleSuppliersSchema } from "../schemas";

export const useDeleteMultipleSuppliers = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMultipleSuppliers,
			createToastCallbacks<null, typeof deleteMultipleSuppliersSchema>({
				loadingMessage: "Suppression des fournisseurs en cours...",
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
