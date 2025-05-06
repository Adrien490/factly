"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreMultipleProducts } from "../actions/restore-multiple-products";
import { restoreMultipleProductsSchema } from "../schemas/restore-multiple-products-schema";

export const useRestoreMultipleProducts = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreMultipleProducts,
			createToastCallbacks<Product[], typeof restoreMultipleProductsSchema>({
				loadingMessage: "Restauration des produits en cours...",
				onSuccess: (response) => {
					clearAll();
					toast.success(response?.message);
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
