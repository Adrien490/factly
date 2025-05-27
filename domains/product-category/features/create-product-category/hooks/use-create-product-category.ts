"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { ProductCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createProductCategory } from "../actions/create-product-category";
import { createProductCategorySchema } from "../schemas";

export function useCreateProductCategory() {
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createProductCategory,
			createToastCallbacks<ProductCategory, typeof createProductCategorySchema>(
				{
					loadingMessage: "Création de la catégorie en cours...",
					action: {
						label: "Voir la catégorie",
						onClick: (data) => {
							if (data?.id) {
								router.push(`/dashboard/products/categories/${data.id}`);
							}
						},
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
}
