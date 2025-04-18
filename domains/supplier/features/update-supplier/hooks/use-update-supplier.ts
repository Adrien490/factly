"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { updateSupplier } from "../actions/update-supplier";
import { updateSupplierSchema } from "../schemas";

export function useUpdateSupplier() {
	const [state, dispatch, isPending] = useActionState<
		ActionState<Supplier, typeof updateSupplierSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateSupplier(previousState, formData);
		},
		{
			message: "",
			status: ActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
