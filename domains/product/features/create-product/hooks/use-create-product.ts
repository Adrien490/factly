"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { createProduct } from "../actions/create-product";
import { createProductSchema } from "../schemas";

export function useCreateProduct() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createProduct,
			createToastCallbacks<Product, typeof createProductSchema>({
				loadingMessage: "Création du produit en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						action: {
							label: "Voir les produits",
							onClick: () => {
								if (result.data?.id) {
									router.push(`/dashboard/products/${result.data.id}`);
								}
							},
						},
					});
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
