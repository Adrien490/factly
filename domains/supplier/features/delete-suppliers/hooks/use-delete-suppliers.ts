"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteSuppliers } from "../actions/delete-suppliers";
import { deleteSuppliersSchema } from "../schemas";

export const useDeleteSuppliers = () => {
	const { clearSelection } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteSuppliers,
			createToastCallbacks<null, typeof deleteSuppliersSchema>({
				loadingMessage: "Suppression des fournisseurs en cours...",
				onSuccess: (data) => {
					clearSelection();
					toast.success(data?.message);
				},
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
