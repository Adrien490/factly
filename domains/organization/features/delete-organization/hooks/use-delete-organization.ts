"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { deleteOrganization } from "../actions";
import { deleteOrganizationSchema } from "../schemas";

export function useDeleteOrganization() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof deleteOrganizationSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await deleteOrganization(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
