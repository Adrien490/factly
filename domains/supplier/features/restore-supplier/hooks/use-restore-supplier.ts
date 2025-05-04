"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { restoreSupplier } from "../actions/restore-supplier";
import { restoreSupplierSchema } from "../schemas";

export const useRestoreSupplier = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			restoreSupplier,
			createToastCallbacks<Supplier, typeof restoreSupplierSchema>({
				loadingMessage: "Restauration du fournisseur en cours...",
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
