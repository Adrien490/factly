"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { deleteAddress } from "../actions";
import { deleteAddressSchema } from "../schemas";

export const useDeleteAddress = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteAddress,
			createToastCallbacks<null, typeof deleteAddressSchema>({
				loadingMessage: "Suppression de l'adresse en cours...",
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
