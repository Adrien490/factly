"use client";

import { ActionStatus } from "@/shared/types/server-action";
import { useActionState } from "react";
import { updateOrganization } from "../actions/update-organization";

export function useUpdateOrganization() {
	const [state, dispatch, isPending] = useActionState(updateOrganization, {
		status: ActionStatus.INITIAL,
		message: "",
	});

	return { state, dispatch, isPending };
}
