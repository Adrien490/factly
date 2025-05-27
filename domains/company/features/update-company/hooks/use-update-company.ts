"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Company } from "@prisma/client";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateCompany } from "../actions/update-company";
import { updateCompanySchema } from "../schemas/update-company-schema";

export function useUpdateCompany() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateCompany,
			createToastCallbacks<Company, typeof updateCompanySchema>({
				loadingMessage: "Mise à jour de l'entreprise en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
					});
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
