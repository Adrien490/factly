"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteMultipleProducts } from "../actions/delete-multiple-products";
import { deleteMultipleProductsSchema } from "../schemas";

export const useDeleteMultipleProducts = () => {
	const { clearAll } = useSelectionContext();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMultipleProducts,
			createToastCallbacks<null, typeof deleteMultipleProductsSchema>({
				loadingMessage: "Suppression des produits en cours...",
				onSuccess: (data) => {
					clearAll();
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
