"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateCompany } from "../actions/update-company";
import { updateCompanySchema } from "../schemas/update-company-schema";

export function useUpdateCompany() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateCompany,
			createToastCallbacks<Company, typeof updateCompanySchema>({
				loadingMessage: "Mise à jour de l'entreprise en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
						action: {
							label: "Voir l'entreprise",
							onClick: () => {
								router.push(`/dashboard/companies/${result.data?.id}`);
							},
						},
					});
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
