"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteProduct } from "../actions/delete-product";
import { deleteProductSchema } from "../schemas";

export const useDeleteProduct = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteProduct,
			createToastCallbacks<Product, typeof deleteProductSchema>({
				loadingMessage: "Suppression du produit en cours...",
				onSuccess: (response) => {
					if (response?.data) {
						clearItems([response.data.id]);
					}
					toast.success(response.message);
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
