"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { archiveMultipleSuppliers } from "../actions/archive-multiple-suppliers";
import { archiveMultipleSuppliersSchema } from "../schemas";

export const useArchiveMultipleSuppliers = () => {
	const { clearAll } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			archiveMultipleSuppliers,
			createToastCallbacks<Supplier[], typeof archiveMultipleSuppliersSchema>({
				loadingMessage: "Archivage des fournisseurs en cours...",
				onSuccess: (result) => {
					toast.success(result.message);
					clearAll();
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
