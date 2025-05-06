"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateMultipleProductStatus } from "../actions/update-multiple-product-status";
import { updateMultipleProductStatusSchema } from "../schemas/update-multiple-product-status-schema";

export const useUpdateMultipleProductStatus = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateMultipleProductStatus,
			createToastCallbacks<Product[], typeof updateMultipleProductStatusSchema>(
				{
					loadingMessage: "Mise à jour du statut des produits en cours...",
					onSuccess: (response) => {
						toast.success(response?.message);
						clearAll();
					},
				}
			)
		),
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
};
