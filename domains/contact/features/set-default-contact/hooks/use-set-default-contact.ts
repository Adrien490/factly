"use client";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { setDefaultContact } from "../actions/set-default-contact";

export const useSetDefaultContact = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			setDefaultContact,
			createToastCallbacks({
				loadingMessage: "Définition du contact par défaut en cours...",
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
