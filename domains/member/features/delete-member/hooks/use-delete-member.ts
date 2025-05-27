"use client";

import { useSelectionContext } from "@/shared/contexts";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Member } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { deleteMember } from "../actions/delete-member";
import { deleteMemberSchema } from "../schemas";

export const useDeleteMember = () => {
	const { clearItems } = useSelectionContext();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			deleteMember,
			createToastCallbacks<Member, typeof deleteMemberSchema>({
				loadingMessage: "Suppression du membre en cours...",
				onSuccess: (response) => {
					if (response?.data) {
						clearItems([response.data.id]);
					}
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
