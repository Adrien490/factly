"use client";

import { useActionState } from "react";
import { deleteOrganization } from "../actions";

export function useDeleteOrganization() {
	const [state, dispatch, isPending] = useActionState(
		deleteOrganization,
		undefined
	);

	return { state, dispatch, isPending };
}
