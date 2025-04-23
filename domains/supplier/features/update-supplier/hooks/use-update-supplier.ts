"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { updateSupplier } from "../actions/update-supplier";
import { updateSupplierSchema } from "../schemas";

export function useUpdateSupplier() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateSupplier,
			createToastCallbacks<Supplier, typeof updateSupplierSchema>({
				loadingMessage: "Mise à jour du fournisseur en cours...",
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
