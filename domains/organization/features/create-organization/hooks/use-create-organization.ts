"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { createOrganization } from "../actions/create-organization";
import { createOrganizationSchema } from "../schemas";
import { CreateOrganizationReturn } from "../types";

interface UseCreateOrganizationProps {
	onSuccessCallback?: () => void;
}

export function useCreateOrganization({
	onSuccessCallback,
}: UseCreateOrganizationProps) {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createOrganization,
			createToastCallbacks<
				CreateOrganizationReturn,
				typeof createOrganizationSchema
			>({
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
					onSuccessCallback?.();
					router.push(`/dashboard`);
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
