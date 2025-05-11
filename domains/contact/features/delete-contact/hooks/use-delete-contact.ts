"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Contact } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteContact } from "../actions/delete-contact";
import { deleteContactSchema } from "../schemas/delete-contact-schema";

export const useDeleteContact = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteContact,
			createToastCallbacks<Contact, typeof deleteContactSchema>({
				loadingMessage: "Suppression du contact en cours...",
				onSuccess: (response) => {
					if (response?.data) {
						clearItems([response.data.id]);
					}
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
