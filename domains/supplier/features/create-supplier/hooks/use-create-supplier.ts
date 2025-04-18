"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { createSupplier } from "../actions/create-supplier";
import { createSupplierSchema } from "../schemas";

export function useCreateSupplier() {
	const [state, dispatch, isPending] = useActionState<
		ActionState<Supplier, typeof createSupplierSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createSupplier(previousState, formData);
		},
		{
			message: "",
			status: ActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
