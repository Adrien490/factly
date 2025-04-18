"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { Address } from "@prisma/client";
import { useActionState } from "react";
import { updateAddress } from "../actions/update-address";
import { updateAddressSchema } from "../schemas";

export function useUpdateAddress() {
	const [state, dispatch, isPending] = useActionState<
		ActionState<Address, typeof updateAddressSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateAddress(previousState, formData);
		},
		{
			message: "",
			status: ActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
