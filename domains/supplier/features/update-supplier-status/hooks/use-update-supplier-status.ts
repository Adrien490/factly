"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { updateSupplierStatus } from "../actions/update-supplier-status";
import { updateSupplierStatusSchema } from "../schemas";

export const useUpdateSupplierStatus = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateSupplierStatus,
			createToastCallbacks<Supplier, typeof updateSupplierStatusSchema>({
				loadingMessage: "Mise à jour du statut du fournisseur en cours...",
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
