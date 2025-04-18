"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { useActionState } from "react";
import { deleteAddress } from "../actions";
import { deleteAddressSchema } from "../schemas";

export const useDeleteAddress = () => {
	const [state, action, isPending] = useActionState<
		ActionState<null, typeof deleteAddressSchema>,
		FormData
	>(deleteAddress, {
		message: "",
		status: ActionStatus.INITIAL,
	});

	return {
		state,
		action,
		isPending,
	};
};
