"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreProduct } from "../actions/restore-product";
import { restoreProductSchema } from "../schemas";

export const useRestoreProduct = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreProduct,
			createToastCallbacks<Product, typeof restoreProductSchema>({
				loadingMessage: "Restauration du produit en cours...",
				onSuccess: (data) => {
					if (data.data?.id) {
						clearItems([data.data.id]);
					}
					toast.success(data.message);
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
