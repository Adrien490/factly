"use client";

import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { createOrganizationSchema } from "../schemas";
import { createOrganization } from "../utils/create-organization";

export function useCreateOrganization() {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof createOrganizationSchema>,
		FormData
	>(
		async (previousState, formData) => {
			return await createOrganization(previousState, formData);
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
		}
	);

	return { state, dispatch, isPending };
}
