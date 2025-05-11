"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Contact } from "@prisma/client";
import { useActionState } from "react";
import { createContact } from "../actions/create-contact";
import { createContactSchema } from "../schemas/create-contact-schema";

export function useCreateContact() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createContact,
			createToastCallbacks<Contact, typeof createContactSchema>({
				loadingMessage: "Création du contact en cours...",
			})
		),
		undefined
	);

	return {
		state,
		dispatch,
		isPending,
	};
}
