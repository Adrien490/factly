"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreMultipleSuppliers } from "../actions/restore-multiple-suppliers";
import { restoreMultipleSuppliersSchema } from "../schemas/restore-multiple-suppliers-schema";

export const useRestoreMultipleSuppliers = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreMultipleSuppliers,
			createToastCallbacks<Supplier[], typeof restoreMultipleSuppliersSchema>({
				loadingMessage: "Restauration des fournisseurs en cours...",
				onSuccess: (response) => {
					clearAll();
					toast.success(response?.message);
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
