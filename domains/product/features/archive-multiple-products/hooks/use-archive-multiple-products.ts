"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveMultipleProducts } from "../actions/archive-multiple-products";
import { archiveMultipleProductsSchema } from "../schemas/archive-multiple-products-schema";

export const useArchiveMultipleProducts = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveMultipleProducts,
			createToastCallbacks<Product[], typeof archiveMultipleProductsSchema>({
				loadingMessage: "Archivage des produits en cours...",
				onSuccess: (response) => {
					toast.success(response?.message);
					clearAll();
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
