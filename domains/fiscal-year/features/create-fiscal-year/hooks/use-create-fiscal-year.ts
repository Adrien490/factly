"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { FiscalYear } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { createFiscalYear } from "../actions";
import { createFiscalYearSchema } from "../schemas";

export function useCreateFiscalYear() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createFiscalYear,
			createToastCallbacks<FiscalYear, typeof createFiscalYearSchema>({
				loadingMessage: "Création de l'année fiscale en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						action: {
							label: "Voir les détails",
							onClick: () => {
								if (result.data?.id) {
									router.push(`/dashboard/fiscal-years`);
								}
							},
						},
					});

					// Redirection vers la liste des années fiscales
					if (result.data?.id) {
						router.push(`/dashboard/fiscal-years`);
					}
				},
			})
		),
		undefined
	);

	return { state, dispatch, isPending };
}
