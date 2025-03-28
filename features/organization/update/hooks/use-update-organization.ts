"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/features/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { updateOrganizationSchema } from "../schemas";
import { updateOrganization } from "../utils/update-organization";

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
