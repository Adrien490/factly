"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier, SupplierStatus } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveSupplier } from "../actions/archive-supplier";
import { archiveSupplierSchema } from "../schemas";

export const useArchiveSupplier = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveSupplier,
			createToastCallbacks<Supplier, typeof archiveSupplierSchema>({
				loadingMessage: "Archivage du fournisseur en cours...",
				onSuccess: (data) => {
					if (data.data?.status === SupplierStatus.ARCHIVED) {
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
