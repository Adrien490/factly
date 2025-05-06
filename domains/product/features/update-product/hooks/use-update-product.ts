"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateProduct } from "../actions/update-product";
import { updateProductSchema } from "../schemas";

/**
 * Hook pour la mise à jour d'un produit
 * Gère l'appel à l'action serveur et le feedback utilisateur
 */
export function useUpdateProduct() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateProduct,
			createToastCallbacks<Product, typeof updateProductSchema>({
				loadingMessage: "Mise à jour du client en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
						action: {
							label: "Voir le client",
							onClick: () => {
								router.push(
									`/dashboard/${result.data?.organizationId}/clients/${result.data?.id}`
								);
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
