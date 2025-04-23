"use client";

import { ActionState, ActionStatus } from "@/shared/types/server-action";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { createOrganization } from "../actions";
import { createOrganizationSchema } from "../schemas";

export function useCreateOrganization() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState<
		ActionState<Organization, typeof createOrganizationSchema>,
		FormData
	>(
		withCallbacks(
			createOrganization,
			createToastCallbacks<Organization, typeof createOrganizationSchema>({
				loadingMessage: "Création de l'organisation en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						action: {
							label: "Accéder au tableau de bord",
							onClick: () => {
								if (result.data?.id) {
									router.push(`/dashboard/${result.data.id}`);
								}
							},
						},
					});
				},
			})
		),
		{ status: ActionStatus.INITIAL, message: "" }
	);

	return { state, dispatch, isPending };
}
