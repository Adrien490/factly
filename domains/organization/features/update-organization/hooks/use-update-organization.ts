"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { updateOrganization } from "../actions/update-organization";
import { updateOrganizationSchema } from "../schemas";

export function useUpdateOrganization() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof updateOrganizationSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await updateOrganization(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
