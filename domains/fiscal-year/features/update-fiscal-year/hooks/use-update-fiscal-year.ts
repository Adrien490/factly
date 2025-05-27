"use client";

import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { FiscalYear } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { updateFiscalYear } from "../actions/update-fiscal-year";
import { updateFiscalYearSchema } from "../schemas";

export function useUpdateFiscalYear() {
	const router = useRouter();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateFiscalYear,
			createToastCallbacks<FiscalYear, typeof updateFiscalYearSchema>({
				loadingMessage: "Mise à jour de l&apos;année fiscale en cours...",
				onSuccess: (result) => {
					toast.success(result.message, {
						duration: 2000,
						action: {
							label: "Voir l&apos;année fiscale",
							onClick: () => {
								router.push(`/dashboard/fiscal-years/${result.data?.id}`);
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
