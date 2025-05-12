"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateOrganization } from "../actions/update-organization";
import { updateOrganizationSchema } from "../schemas";

export function useUpdateOrganization() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateOrganization,
			createToastCallbacks<Organization, typeof updateOrganizationSchema>({
				loadingMessage: "Mise à jour de l'organisation en cours...",
				onSuccess: (result) => {
					toast.success(result.message);
					router.refresh();
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
