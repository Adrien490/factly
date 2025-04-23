"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import router from "next/router";
import { useActionState } from "react";
import { toast } from "sonner";
import { createSupplier } from "../actions/create-supplier";
import { createSupplierSchema } from "../schemas";

export function useCreateSupplier() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createSupplier,
			createToastCallbacks<Supplier, typeof createSupplierSchema>({
				loadingMessage: "Création du fournisseur en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						action: {
							label: "Voir le fournisseur",
							onClick: () => {
								if (result.data?.id) {
									router.push(
										`/dashboard/${result.data.organizationId}/suppliers/${result.data.id}`
									);
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
