"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveSupplier } from "../actions/archive-supplier";
import { archiveSupplierSchema } from "../schemas/archive-supplier-schema";

export const useArchiveSupplier = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveSupplier,
			createToastCallbacks<Supplier, typeof archiveSupplierSchema>({
				loadingMessage: "Archivage du fournisseur en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
					});
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
};
