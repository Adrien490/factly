"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteMultipleSuppliers } from "../actions";
import { deleteMultipleSuppliersSchema } from "../schemas";

export const useDeleteMultipleSuppliers = () => {
	const { clearSelection } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMultipleSuppliers,
			createToastCallbacks<null, typeof deleteMultipleSuppliersSchema>({
				loadingMessage: "Suppression des fournisseurs en cours...",
				onSuccess: (data) => {
					clearSelection();
					toast.success(data?.message);
				},
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
