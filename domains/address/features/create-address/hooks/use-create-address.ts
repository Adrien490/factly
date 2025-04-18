"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { Address } from "@prisma/client";
import { useActionState } from "react";
import { createAddress } from "../actions/create-address";
import { createAddressSchema } from "../schemas";

export function useCreateAddress() {
	const [state, dispatch, isPending] = useActionState<
		ActionState<Address, typeof createAddressSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createAddress(previousState, formData);
		},
		{
			message: "",
			status: ActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
