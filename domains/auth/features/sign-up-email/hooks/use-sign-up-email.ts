import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { useActionState } from "react";
import { toast } from "sonner";
import { signUpEmail } from "../actions/sign-up-email";

export function useSignUpEmail() {
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			signUpEmail,
			createToastCallbacks({
				loadingMessage: "Inscription en cours...",
				onSuccess: (data) => {
					toast.success(data?.message, {
						duration: 3000,
					});
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
