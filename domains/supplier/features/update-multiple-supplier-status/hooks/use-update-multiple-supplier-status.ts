"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateMultipleSupplierStatus } from "../actions/update-multiple-supplier-status";
import { updateMultipleSupplierStatusSchema } from "../schemas/update-multiple-supplier-status-schema";

export const useUpdateMultipleSupplierStatus = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateMultipleSupplierStatus,
			createToastCallbacks<null, typeof updateMultipleSupplierStatusSchema>({
				loadingMessage: "Mise à jour du statut en cours...",
				onSuccess: (data) => {
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
