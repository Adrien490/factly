"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { updateProductStatus } from "../actions/update-product-status";
import { updateProductStatusSchema } from "../schemas";

export const useUpdateProductStatus = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateProductStatus,
			createToastCallbacks<Product, typeof updateProductStatusSchema>({
				loadingMessage: "Mise à jour du statut du produit en cours...",
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
