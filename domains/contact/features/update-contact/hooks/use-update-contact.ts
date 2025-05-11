"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Contact } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateContact } from "../actions/update-contact";
import { updateContactSchema } from "../schemas/update-contact-schema";

export const useUpdateContact = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateContact,
			createToastCallbacks<Contact, typeof updateContactSchema>({
				loadingMessage: "Mise à jour du contact en cours...",
				onSuccess: (response) => {
					toast.success(response.message);
				},
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
