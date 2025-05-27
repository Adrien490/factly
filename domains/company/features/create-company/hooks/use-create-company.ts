"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createCompany } from "../actions/create-company";
import { createCompanySchema } from "../schemas/create-company-schema";

export function useCreateCompany() {
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createCompany,
			createToastCallbacks<Company, typeof createCompanySchema>({
				loadingMessage: "Création de l'entreprise en cours...",
				action: {
					label: "Voir l'entreprise",
					onClick: (data) => {
						if (data?.id) {
							router.push(`/dashboard/companies/${data.id}`);
						}
					},
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
}
