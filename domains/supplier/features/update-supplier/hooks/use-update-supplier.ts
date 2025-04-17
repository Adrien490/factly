"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Supplier } from "@prisma/client";
import { useActionState } from "react";
import { updateSupplier } from "../actions/update-supplier";
import { updateSupplierSchema } from "../schemas";

export function useUpdateSupplier() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Supplier, typeof updateSupplierSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateSupplier(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
