"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Organization } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { softDeleteOrganization } from "../actions/soft-delete-organization";
import { softDeleteOrganizationSchema } from "../schemas/soft-delete-organization-schema";

export const useSoftDeleteOrganization = () => {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			softDeleteOrganization,
			createToastCallbacks<Organization, typeof softDeleteOrganizationSchema>({
				loadingMessage: "Suppression de l'organisation en cours...",
				onSuccess: (response) => {
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
