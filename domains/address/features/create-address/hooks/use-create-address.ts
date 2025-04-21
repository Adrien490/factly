"use client";

import { withCallbacks } from "@/shared/utils";
import { createToastCallbacks } from "@/shared/utils/create-toast-callbacks";
import { Address } from "@prisma/client";
import { useActionState } from "react";
import { createAddress } from "../actions/create-address";
import { createAddressSchema } from "../schemas";

export function useCreateAddress() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createAddress,
			createToastCallbacks<Address, typeof createAddressSchema>({
				loadingMessage: "Création de l'adresse en cours...",
			})
		),
		null
	);

	return { state, dispatch, isPending };
}
