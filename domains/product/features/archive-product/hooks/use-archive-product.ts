"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveProduct } from "../actions/archive-product";
import { archiveProductSchema } from "../schemas";

export const useArchiveProduct = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveProduct,
			createToastCallbacks<Product, typeof archiveProductSchema>({
				loadingMessage: "Archivage du produit en cours...",
				onSuccess: (response) => {
					if (response.data) {
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
