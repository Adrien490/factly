"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { createOrganization } from "../actions";
import { createOrganizationSchema } from "../schemas";

export function useCreateOrganization() {
	const [state, dispatch, isPending] = useActionState<
		ActionState<Organization, typeof createOrganizationSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createOrganization(previousState, formData);
		},
		{
			message: "",
			status: ActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
