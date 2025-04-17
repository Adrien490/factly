"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { useActionState } from "react";
import { deleteAddress } from "../actions";
import { deleteAddressSchema } from "../schemas";

export const useDeleteAddress = () => {
	const [state, action, isPending] = useActionState<
		ServerActionState<null, typeof deleteAddressSchema>,
		FormData
	>(deleteAddress, {
		message: "",
		status: ServerActionStatus.INITIAL,
	});

	return {
		state,
		action,
		isPending,
	};
};
