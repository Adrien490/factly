"use client";

import { useSelection } from "@/hooks/use-selection";
import { useParams } from "next/navigation";
import { useActionState, useTransition } from "react";
import { CLIENT_SELECTION_KEY } from "../lib/constants";
import deleteClient from "../server/delete-client";

export const useClients = () => {
	const { handleItemSelectionChange } = useSelection(CLIENT_SELECTION_KEY);
	const [deleteState, deleteAction] = useActionState(deleteClient, null);
	const [isPending, startTransition] = useTransition();
	const params = useParams();
	const { organizationId } = params;

	const handleDelete = (id: string) => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId as string);

		// Mise à jour optimiste de la sélection
		handleItemSelectionChange(id, false);

		startTransition(() => {
			deleteAction(formData);
		});
	};

	return {
		deleteState,
		handleDelete,
		isPending,
	};
};
