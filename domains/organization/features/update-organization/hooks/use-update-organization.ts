"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { updateOrganization } from "../actions/update-organization";
import { updateOrganizationSchema } from "../schemas";

export function useUpdateOrganization() {
	const [state, dispatch, isPending] = useActionState<
		ActionState<Organization, typeof updateOrganizationSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateOrganization(previousState, formData);
		},
		{
			message: "",
			status: ActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
