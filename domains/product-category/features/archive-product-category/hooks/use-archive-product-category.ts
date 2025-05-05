"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { ProductCategory } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveProductCategory } from "../actions/archive-product-category";
import { archiveProductCategorySchema } from "../schemas";

export const useArchiveProductCategory = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveProductCategory,
			createToastCallbacks<
				ProductCategory,
				typeof archiveProductCategorySchema
			>({
				loadingMessage: "Archivage de la catégorie en cours...",
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
