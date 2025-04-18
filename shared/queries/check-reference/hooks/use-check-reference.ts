import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { checkReference } from "../queries/check-reference";
import { checkReferenceSchema } from "../schemas";
import { CheckReferenceResponse } from "../types";

export function useCheckReference() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			checkReference,
			createToastCallbacks<CheckReferenceResponse, typeof checkReferenceSchema>(
				{
					loadingMessage: "Vérification de la référence en cours...",
					onSuccess: (result) => {
						if (result.data?.exists) {
							toast.error("Cette référence existe déjà");
						} else if (result.message) {
							toast.success(result.message, {
								duration: 1750,
							});
						}
					},
				}
			)
		),
		null
	);

	return { state, dispatch, isPending };
}
